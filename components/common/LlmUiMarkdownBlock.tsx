import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type LLMOutputComponent } from "@llm-ui/react";
import PropTypes from "prop-types";

// Markdown block for llm-ui
const MarkdownComponent: LLMOutputComponent = ({ blockMatch }) => {
  const markdown = blockMatch.output;
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>;
};

MarkdownComponent.propTypes = {
  blockMatch: PropTypes.shape({
    output: PropTypes.string.isRequired,
  }).isRequired,
};

export default MarkdownComponent;
