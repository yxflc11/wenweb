import Markdoc, { type Node } from "@markdoc/markdoc";
import * as React from "react";

// Renders a Keystatic Markdoc node to React (standard h2/p/ul/pre/blockquote…),
// so the existing .prose styles apply unchanged.
export default function MarkdocContent({ node }: { node: Node }) {
  const renderable = Markdoc.transform(node);
  return <>{Markdoc.renderers.react(renderable, React)}</>;
}
