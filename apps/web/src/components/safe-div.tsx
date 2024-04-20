import DOMPurify from "dompurify";

export function SafeDiv({
  html,
  ...props
}: React.HTMLProps<HTMLDivElement> & { html: string }) {
  const clean = DOMPurify.sanitize(html);
  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{
        __html: clean,
      }}
    />
  );
}
