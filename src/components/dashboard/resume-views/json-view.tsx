import { mockParsedResume } from "@/data/mock-resume";

export function JsonView() {
  const jsonString = JSON.stringify(mockParsedResume, null, 2);

  return (
    <div className="rounded-xl border bg-[#0d1117] overflow-hidden shadow-sm shadow-black/20">
      <div className="flex items-center px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <p className="text-xs text-white/50 ml-4 font-mono">parsed_resume.json</p>
      </div>
      <div className="p-4 overflow-auto max-h-[800px] text-sm">
        <pre className="font-mono text-[13px] leading-relaxed text-[#c9d1d9]">
          <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonString) }} />
        </pre>
      </div>
    </div>
  );
}

// Minimal JSON syntax highlighter for aesthetic developer feel
function syntaxHighlight(json: string) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'text-[#79c0ff]'; // number
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'text-[#d2a8ff]'; // key
          } else {
              cls = 'text-[#a5d6ff]'; // string
          }
      } else if (/true|false/.test(match)) {
          cls = 'text-[#ff7b72]'; // boolean
      } else if (/null/.test(match)) {
          cls = 'text-[#ff7b72]'; // null
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}
