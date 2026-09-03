import Foundation
import ImageIO
import Vision

struct VisionLine: Codable {
    let text: String
    let x: Double
    let y: Double
    let width: Double
    let height: Double
    let confidence: Int
}

struct VisionPage: Codable {
    let page: Int
    let lines: [VisionLine]
}

let arguments = CommandLine.arguments
guard arguments.count >= 3 else {
    FileHandle.standardError.write(Data("Usage: swift build-ple1a-vision-ocr.swift <image-directory-or-file> <output-json>\n".utf8))
    exit(1)
}

let source = URL(fileURLWithPath: arguments[1])
let output = URL(fileURLWithPath: arguments[2])
let fileManager = FileManager.default
var isDirectory: ObjCBool = false
guard fileManager.fileExists(atPath: source.path, isDirectory: &isDirectory) else {
    fatalError("Source does not exist: \(source.path)")
}

let imageURLs: [URL]
if isDirectory.boolValue {
    imageURLs = try fileManager.contentsOfDirectory(at: source, includingPropertiesForKeys: nil)
        .filter { $0.lastPathComponent.range(of: #"^page-\d+\.jpg$"#, options: .regularExpression) != nil }
        .sorted { $0.lastPathComponent < $1.lastPathComponent }
} else {
    imageURLs = [source]
}

var pages: [VisionPage] = []
for (index, imageURL) in imageURLs.enumerated() {
    autoreleasepool {
        guard let sourceRef = CGImageSourceCreateWithURL(imageURL as CFURL, nil),
              let image = CGImageSourceCreateImageAtIndex(sourceRef, 0, nil) else { return }

        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.recognitionLanguages = ["en-US"]
        request.usesLanguageCorrection = true
        request.minimumTextHeight = 0.006

        do {
            try VNImageRequestHandler(cgImage: image, options: [:]).perform([request])
            let observations = request.results ?? []
            let lines = observations.compactMap { observation -> VisionLine? in
                guard let candidate = observation.topCandidates(1).first else { return nil }
                let box = observation.boundingBox
                return VisionLine(
                    text: candidate.string,
                    x: box.origin.x * 100,
                    y: (1 - box.origin.y - box.height) * 100,
                    width: box.width * 100,
                    height: box.height * 100,
                    confidence: Int((candidate.confidence * 100).rounded())
                )
            }
            let page = Int(imageURL.deletingPathExtension().lastPathComponent.replacingOccurrences(of: "page-", with: "")) ?? index + 1
            pages.append(VisionPage(page: page, lines: lines))
            print("Vision OCR \(index + 1)/\(imageURLs.count): \(imageURL.lastPathComponent) — \(lines.count) lines")
        } catch {
            FileHandle.standardError.write(Data("Vision OCR failed for \(imageURL.path): \(error)\n".utf8))
        }
    }
}

let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
try encoder.encode(pages).write(to: output)
