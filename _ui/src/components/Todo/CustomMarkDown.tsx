import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

export default function CustomMarkDown({ content }: Props) {
  return (
    <div className="break-words">
      <Markdown
        remarkPlugins={[remarkGfm]}
        // note: need to add own component for HTML bc tailwaind defaults eg. h1,h2... to the same size
        components={{
          h1(props) {
            const { node, ...rest } = props;
            return <h1 className="text-xl" {...rest} />;
          },
          h2(props) {
            const { node, ...rest } = props;
            return <h2 className="text-2xl" {...rest} />;
          },
          h3(props) {
            const { node, ...rest } = props;
            return <h3 className="text-3xl" {...rest} />;
          },
          ul(props) {
            const { node, ...rest } = props;
            return <ul className="list-disc list-inside" {...rest}></ul>;
          },
          ol(props) {
            const { node, ...rest } = props;
            return <ol className="list-decimal list-inside" {...rest}></ol>;
          },
          blockquote(props) {
            const { node, ...rest } = props;
            return (
              <blockquote
                className="indent-4 opacity-60"
                {...rest}
              ></blockquote>
            );
          },
          code(props) {
            const { node, ...rest } = props;
            return (
              <pre className="bg-slate-600 text-sm p-1">
                <code {...rest}></code>
              </pre>
            );
          },

          input(props) {
            const { node, ...rest } = props;
            return (
              <div className="relative inline-flex align-middle">
                <input
                  className="appearance-none peer w-4 h-4 border rounded-lg border-slate-800 bg-slate-800"
                  {...rest}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 fill-emerald-400 stroke-emerald-400 text-white opacity-0 peer-checked:opacity-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            );
          },
          a(props) {
            const { node, ...rest } = props;
            return (
              <a
                className="text-pink-800 hover:text-pink-300 italic"
                {...rest}
              ></a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
