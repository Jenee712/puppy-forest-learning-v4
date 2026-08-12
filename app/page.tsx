import type { Metadata } from "next";
import { V4Dashboard } from "./V4Dashboard";

export const metadata: Metadata = {
  title: "小狗的森林学堂 V4",
  description: "面向3至12岁孩子的智能成长与学习平台。",
};

export default function Home() {
  return <V4Dashboard />;
}
