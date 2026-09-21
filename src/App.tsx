import { useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  Check,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Code2,
  Copy,
  Database,
  ExternalLink,
  FileCode2,
  GitFork,
  KeyRound,
  Menu,
  Moon,
  Package,
  Play,
  Search,
  Server,
  ShieldCheck,
  Sun,
  Terminal,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const packageName = "@nobertdev/bc-intergration-starter";
const githubUrl = "https://github.com/NOBERT167/bc-intergration-starter";
const npmUrl =
  "https://www.npmjs.com/package/@nobertdev/bc-intergration-starter";

const navGroups = [
  {
    label: "Start here",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick start" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { id: "prompts", label: "Prompt reference" },
      { id: "authentication", label: "Authentication" },
      { id: "app-settings", label: "App settings" },
      { id: "project-structure", label: "Project structure" },
    ],
  },
  {
    label: "Reference",
    items: [
      { id: "cli-options", label: "CLI options" },
      { id: "run-project", label: "Run the project" },
      { id: "troubleshooting", label: "Troubleshooting" },
    ],
  },
];

const promptRows = [
  ["Project name", "A lowercase name such as staff-portal"],
  ["Target .NET version", "Installed and template-supported SDK versions"],
  ["API hosting", "Windows / IIS or Linux / container"],
  ["BC authentication", "NTLM, Windows, process identity, or Basic over HTTPS"],
  ["OData URL", "The complete company URL ending in /"],
  ["Codeunit URL", "The complete published SOAP codeunit URL"],
  ["API protection", "JWT bearer or configure later"],
  [
    "User authentication",
    "Active Directory or BC LoginAsJson when JWT is selected",
  ],
  [
    "Starter features",
    "Scalar, sample records, dropdown endpoint, and frontend libraries",
  ],
];

const configExample = `{
  "name": "staff-portal",
  "framework": "10.0",
  "hosting": "windows",
  "bcAuth": "ntlm",
  "odataUrl": "http://bc-server:9048/BC/ODataV4/Company('Example')/",
  "codeunitUrl": "http://bc-server:9047/BC/WS/Example/Codeunit/PortalIntegration",
  "apiAuth": "jwt",
  "authenticationMethod": "bc",
  "docs": true,
  "sample": true,
  "sampleEntity": "Customers",
  "dropdown": true,
  "tailwind": true,
  "shadcn": true,
  "tanstackQuery": true
}`;

const appSettingsExample = `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}`;

const projectTree = `staff-portal/
├── staff-portal.sln
├── run.cmd
├── bc-team-starter.json
├── server/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Extensions/
│   ├── Interfaces/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   ├── Server.csproj
│   ├── appsettings.json
│   └── appsettings.Development.json
└── client/
    ├── public/
    ├── src/
    ├── components.json
    └── package.json`;

type CodeBlockProps = {
  children: string;
  label?: string;
};

function CodeBlock({ children, label = "code" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border/60 bg-code-background">
      <div className="flex min-h-9 items-center justify-between border-b border-code-foreground/10 px-2 pl-3">
        <span className="font-mono text-[0.65rem] tracking-wide text-code-muted">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-auto gap-1 rounded-md border-0 bg-transparent px-2 py-1 text-[0.68rem] text-code-muted hover:bg-code-foreground/10 hover:text-code-foreground"
          onClick={copyCode}
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="m-0 overflow-x-auto p-4 font-mono text-xs leading-relaxed text-code-foreground [tab-size:2]">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-10 max-w-3xl">
      <span className="font-mono text-[0.7rem] font-semibold tracking-[0.07em] text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-3 mb-3 text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold tracking-[-0.045em] text-balance">
        {title}
      </h2>
      <p className="m-0 max-w-[62ch] text-[0.98rem] leading-7 text-muted-foreground text-pretty">
        {description}
      </p>
    </header>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.getItem("bc-docs-theme") === "dark" ||
      (!localStorage.getItem("bc-docs-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("bc-docs-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -66% 0px", threshold: [0.05, 0.2, 0.5] },
    );

    navGroups
      .flatMap((group) => group.items)
      .forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setMobileOpen(false);
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return navGroups;
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(normalized),
        ),
      }))
      .filter((group) => group.items.length);
  }, [query]);

  function closeNavigation() {
    setMobileOpen(false);
    setQuery("");
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        className="fixed top-3 left-3 z-50 -translate-y-[150%] rounded-lg bg-primary px-3.5 py-2.5 text-primary-foreground transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 hidden min-h-16 items-center justify-between border-b bg-card/90 px-5 backdrop-blur-xl max-[980px]:flex max-[520px]:px-3">
        <a
          className="flex items-center gap-3 text-foreground no-underline [&>span:last-child]:grid [&>span:last-child]:leading-tight [&_strong]:text-[0.95rem] [&_strong]:font-semibold [&_strong]:tracking-tight [&_small]:mt-0.5 [&_small]:text-[0.69rem] [&_small]:text-muted-foreground"
          href="#introduction"
          aria-label="BC Starter documentation home"
        >
          <span className="grid size-9 place-items-center rounded-[0.65rem_0.65rem_0.25rem_0.65rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Database size={18} />
          </span>
          <span>
            <strong>BC Starter</strong>
            <small>documentation</small>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <Button
            className="size-9 rounded-lg border-border bg-transparent p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setDarkMode((value) => !value)}
            aria-label="Toggle color theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button
            className="size-9 rounded-lg border-border bg-transparent p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </header>

      {mobileOpen && (
        <Button
          className="fixed inset-0 z-20 h-auto w-auto min-w-0 rounded-none border-0 bg-foreground/50 p-0 backdrop-blur-xs min-[981px]:hidden"
          type="button"
          variant="ghost"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-70 flex-col border-r bg-card/95 p-4 backdrop-blur-xl transition-transform duration-200 max-[980px]:w-66",
          mobileOpen
            ? "max-[980px]:translate-x-0 max-[980px]:shadow-2xl max-[980px]:shadow-foreground/20"
            : "max-[980px]:-translate-x-[105%]",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <a
            className="flex items-center gap-3 text-foreground no-underline [&>span:last-child]:grid [&>span:last-child]:leading-tight [&_strong]:text-[0.95rem] [&_strong]:font-semibold [&_strong]:tracking-tight [&_small]:mt-0.5 [&_small]:text-[0.69rem] [&_small]:text-muted-foreground"
            href="#introduction"
            onClick={closeNavigation}
          >
            <span className="grid size-9 place-items-center rounded-[0.65rem_0.65rem_0.25rem_0.65rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Database size={18} />
            </span>
            <span>
              <strong>BC Starter</strong>
              <small>documentation</small>
            </span>
          </a>
          <Button
            className="size-9 rounded-lg border-border bg-transparent p-0 text-muted-foreground hover:bg-muted hover:text-foreground max-[980px]:hidden"
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setDarkMode((value) => !value)}
            aria-label="Toggle color theme"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
        </div>

        <label className="my-5 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg border border-transparent bg-muted px-3 py-2 text-muted-foreground transition-colors focus-within:border-ring focus-within:bg-card">
          <Search size={16} />
          <Input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sections"
            aria-label="Search documentation sections"
            className="h-auto rounded-none border-0 bg-transparent p-0 text-sm shadow-none outline-none focus-visible:ring-0"
          />
          <kbd className="rounded border bg-card px-1.5 py-0.5 text-[0.67rem] text-muted-foreground">
            /
          </kbd>
        </label>

        <nav
          className="flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]"
          aria-label="Documentation navigation"
        >
          {filteredGroups.length ? (
            filteredGroups.map((group) => (
              <div className="mt-5 first:mt-0" key={group.label}>
                <p className="mb-1 ml-3 text-[0.66rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "flex min-h-9 items-center justify-between rounded-lg px-3 py-1.5 text-[0.82rem] text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground",
                      activeSection === item.id &&
                        "bg-accent font-semibold text-accent-foreground",
                    )}
                    onClick={closeNavigation}
                  >
                    {item.label}
                    {activeSection === item.id && <ChevronRight size={14} />}
                  </a>
                ))}
              </div>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-muted-foreground">
              No matching sections
            </p>
          )}
        </nav>

        <div className="grid gap-1 border-t pt-3 [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-md [&_a]:px-2 [&_a]:py-2 [&_a]:text-xs [&_a]:text-muted-foreground [&_a]:no-underline [&_a:hover]:bg-muted [&_a:hover]:text-foreground [&_a_svg:last-child]:ml-auto [&_a_svg:last-child]:opacity-60">
          <a href={githubUrl} target="_blank" rel="noreferrer">
            <GitFork size={16} /> GitHub <ExternalLink size={13} />
          </a>
          <a href={npmUrl} target="_blank" rel="noreferrer">
            <Package size={16} /> npm package <ExternalLink size={13} />
          </a>
        </div>
      </aside>

      <main
        id="main-content"
        className="ml-70 max-[980px]:ml-0 [&_p_code]:rounded [&_p_code]:bg-accent [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:font-mono [&_p_code]:text-[0.84em] [&_p_code]:text-accent-foreground [&_li_code]:rounded [&_li_code]:bg-accent [&_li_code]:px-1.5 [&_li_code]:py-0.5 [&_li_code]:font-mono [&_li_code]:text-[0.84em] [&_li_code]:text-accent-foreground [&_td_code]:rounded [&_td_code]:bg-accent [&_td_code]:px-1.5 [&_td_code]:py-0.5 [&_td_code]:font-mono [&_td_code]:text-[0.84em] [&_td_code]:text-accent-foreground"
      >
        <article className="mx-auto w-[min(calc(100%_-_3rem),72rem)] max-[760px]:w-[min(calc(100%_-_2rem),42rem)] max-[520px]:w-[min(calc(100%_-_1.4rem),42rem)]">
          <section
            id="introduction"
            className="grid min-h-[42rem] scroll-mt-8 grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.65fr)] items-center gap-[clamp(2rem,6vw,6rem)] border-b py-20 pt-26 max-[980px]:min-h-0 max-[980px]:pt-20 max-[760px]:grid-cols-1 max-[760px]:gap-10 max-[760px]:py-14 max-[520px]:pt-12"
          >
            <div className="min-w-0 [&>h1]:m-0 [&>h1]:max-w-[12ch] [&>h1]:text-[clamp(3.15rem,6vw,5.8rem)] [&>h1]:leading-[0.93] [&>h1]:font-semibold [&>h1]:tracking-[-0.065em] [&>h1]:text-balance max-[760px]:[&>h1]:text-[clamp(3rem,15vw,4.8rem)]">
              <div className="mb-6 flex flex-wrap gap-3">
                <Badge className="rounded-md px-2 py-1 tracking-wide">
                  v0.1.0
                </Badge>
                <Badge
                  className="rounded-md px-2 py-1 tracking-wide"
                  variant="outline"
                >
                  ASP.NET Core + React
                </Badge>
              </div>
              {/* <h1 className="text-4xl! max-w-2xl leading-7 text-foreground text-pretty"> */}
              <h2 className="mt-3 mb-3 text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold tracking-[-0.045em] text-balance">
                Business Central starters, ready in one command.
              </h2>
              <p className="mt-7 max-w-2xl text-[clamp(1.02rem,1.5vw,1.18rem)] leading-7 text-muted-foreground text-pretty">
                Generate the solution structure your team already understands,
                with OData, SOAP, JWT, Scalar, and a configured React client.
              </p>

              <Tabs className="mt-8 max-w-2xl gap-0" defaultValue="npx">
                <TabsList
                  className="mb-[-1px] h-auto w-max rounded-b-none rounded-t-lg border border-b-0 bg-muted p-1 max-[520px]:w-full"
                  aria-label="Installation method"
                >
                  <TabsTrigger
                    className="h-auto rounded-md px-3 py-1.5 text-xs"
                    value="npx"
                  >
                    npx
                  </TabsTrigger>
                  <TabsTrigger
                    className="h-auto rounded-md px-3 py-1.5 text-xs"
                    value="global"
                  >
                    global install
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  className="m-0 [&>div]:rounded-tl-none"
                  value="npx"
                >
                  <CodeBlock label="terminal">{`npx ${packageName}@latest`}</CodeBlock>
                </TabsContent>
                <TabsContent
                  className="m-0 [&>div]:rounded-tl-none"
                  value="global"
                >
                  <CodeBlock label="terminal">{`npm install --global ${packageName}\nbc-intergration-starter`}</CodeBlock>
                </TabsContent>
              </Tabs>

              <div className="mt-5 flex items-center gap-4 max-[520px]:flex-col max-[520px]:items-start max-[520px]:gap-1">
                <a
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground no-underline transition-transform hover:-translate-y-px"
                  href="#quick-start"
                >
                  <Play size={16} /> Start generating
                </a>
                <a
                  className="inline-flex min-h-10 items-center gap-2 px-1 text-sm font-semibold text-muted-foreground no-underline hover:text-primary"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitFork size={16} /> View source
                </a>
              </div>
            </div>

            <Card
              className="rotate-[1.5deg] gap-0 rounded-[1rem_1rem_0.35rem_1rem] border p-4 shadow-2xl shadow-primary/10 max-[760px]:w-[min(100%,22rem)] max-[760px]:rotate-0"
              aria-label="Generated stack summary"
            >
              <CardHeader className="p-1 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Boxes size={18} /> Generated stack
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="m-0 list-none border-t p-0 [&_li]:flex [&_li]:justify-between [&_li]:gap-4 [&_li]:border-b [&_li]:px-1 [&_li]:py-3 [&_li]:text-xs [&_li_span]:text-muted-foreground [&_li_strong]:font-semibold">
                  <li>
                    <span>.NET</span>
                    <strong>8 / 9 / 10</strong>
                  </li>
                  <li>
                    <span>API</span>
                    <strong>Controllers</strong>
                  </li>
                  <li>
                    <span>Frontend</span>
                    <strong>React + Vite</strong>
                  </li>
                  <li>
                    <span>BC data</span>
                    <strong>OData + SOAP</strong>
                  </li>
                  <li>
                    <span>UI</span>
                    <strong>shadcn + Tailwind</strong>
                  </li>
                </ul>
                <Separator className="hidden" />
                <p className="mt-4 flex items-center gap-2 px-1 text-xs text-primary">
                  <Check size={15} /> Existing folders are never overwritten.
                </p>
              </CardContent>
            </Card>
          </section>

          <div
            className="flex items-center justify-center gap-2 overflow-x-auto border-b p-4 font-mono text-[0.7rem] whitespace-nowrap text-muted-foreground [&_span]:text-muted-foreground [&_svg]:text-input max-[760px]:justify-start max-[760px]:px-0"
            aria-label="Generated request flow"
          >
            <span>React client</span>
            <ChevronRight size={15} />
            <span>Controller</span>
            <ChevronRight size={15} />
            <span>Service</span>
            <ChevronRight size={15} />
            <span>OData / SOAP</span>
            <ChevronRight size={15} />
            <span>Business Central</span>
          </div>

          <section
            id="installation"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="01 — Install"
              title="What you need"
              description="The CLI checks your installed SDKs and only offers template versions that can run on your machine."
            />
            <div className="grid grid-cols-[1.45fr_0.8fr] items-start gap-4 max-[760px]:grid-cols-1">
              <Card className="gap-0 rounded-[0.9rem_0.9rem_0.3rem_0.9rem] border p-7">
                <CardHeader className="p-0 [&>svg]:text-primary">
                  <Terminal size={22} />
                  <CardTitle className="mt-4 mb-3 text-base">
                    Development tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="m-0 grid list-none gap-2.5 p-0 text-sm text-muted-foreground [&_li]:flex [&_li]:items-center [&_li]:gap-2 [&_svg]:shrink-0 [&_svg]:text-primary">
                    <li>
                      <Check size={15} /> Node.js 22.13.0 or later
                    </li>
                    <li>
                      <Check size={15} /> npm
                    </li>
                    <li>
                      <Check size={15} /> .NET SDK 8, 9, or 10
                    </li>
                    <li>
                      <Check size={15} /> Visual Studio with WCF Web Service
                      Reference support
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="mt-10 gap-0 rounded-[0.3rem_0.9rem_0.9rem_0.9rem] border bg-muted p-7 max-[760px]:mt-0">
                <CardHeader className="p-0 [&>svg]:text-primary">
                  <Server size={21} />
                  <CardTitle className="mt-4 mb-3 text-base">
                    Business Central access
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-sm leading-7">
                    You need the complete OData company URL and the complete
                    published SOAP codeunit URL. The generator never asks for a
                    separate service instance.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          <section
            id="quick-start"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="02 — Generate"
              title="Quick start"
              description="Run the CLI, answer the prompts, then connect the generated server to your published BC codeunit."
            />
            <ol className="m-0 grid list-none gap-0 p-0 [&>li]:grid [&>li]:grid-cols-[3rem_minmax(0,1fr)] [&>li]:gap-4 [&>li]:pb-8 [&>li>div]:min-w-0 [&>li>span]:grid [&>li>span]:size-8 [&>li>span]:place-items-center [&>li>span]:rounded-full [&>li>span]:bg-accent [&>li>span]:font-mono [&>li>span]:text-xs [&>li>span]:font-bold [&>li>span]:text-accent-foreground [&_h3]:mt-1 [&_h3]:mb-2.5 [&_h3]:text-base [&_p]:m-0 [&_p]:max-w-[62ch] [&_p]:text-sm [&_p]:leading-7 [&_p]:text-muted-foreground">
              <li>
                <span>1</span>
                <div>
                  <h3>Start the generator</h3>
                  <CodeBlock label="terminal">{`npx ${packageName}@latest`}</CodeBlock>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <h3>Choose your integration</h3>
                  <p>
                    Enter the full BC URLs, select API protection, then choose
                    the endpoints and frontend tools your project needs.
                  </p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <h3>Add the connected service</h3>
                  <p>
                    Open the generated solution in Visual Studio and add a WCF
                    Web Service Reference named <code>NAVWS</code> using the
                    codeunit URL plus <code>?wsdl</code>.
                  </p>
                </div>
              </li>
              <li>
                <span>4</span>
                <div>
                  <h3>Install and run</h3>
                  <CodeBlock label="terminal">
                    {"cd staff-portal/client\nnpm install\ncd ..\nrun.cmd"}
                  </CodeBlock>
                </div>
              </li>
            </ol>
            <Alert className="gap-x-3 border-accent bg-accent text-accent-foreground [&_[data-slot=alert-description]]:text-accent-foreground">
              <CircleHelp size={18} />
              <AlertTitle>Expected first-run state</AlertTitle>
              <AlertDescription>
                The server can show build errors until Visual Studio generates
                the project-specific <code>NAVWS</code> proxy.
              </AlertDescription>
            </Alert>
          </section>

          <section
            id="prompts"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="03 — Choices"
              title="Prompt reference"
              description="Each answer changes the generated files and registrations. Press Enter to accept the highlighted default."
            />
            <Card className="gap-0 overflow-hidden rounded-xl border py-0">
              <Table className="[&_th]:bg-muted [&_th]:text-xs [&_th]:tracking-wide [&_th]:text-muted-foreground [&_th]:uppercase [&_td:first-child]:font-semibold [&_td:last-child]:text-muted-foreground max-[520px]:min-w-144">
                <TableHeader>
                  <TableRow>
                    <TableHead>Prompt</TableHead>
                    <TableHead>What it controls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promptRows.map(([name, description]) => (
                    <TableRow key={name}>
                      <TableCell>{name}</TableCell>
                      <TableCell>{description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

          <section
            id="authentication"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="04 — Identity"
              title="Two authentication layers"
              description="BC service-tier credentials connect the server to Business Central. User authentication protects the generated application API."
            />
            <div className="grid grid-cols-[0.92fr_1.08fr] items-start gap-4 max-[760px]:grid-cols-1">
              <Card className="mt-10 gap-0 rounded-md border p-7 max-[760px]:mt-0">
                <CardHeader className="p-0">
                  <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <KeyRound size={20} />
                  </div>
                  <Badge
                    className="mt-5 tracking-wider uppercase"
                    variant="secondary"
                  >
                    Active Directory
                  </Badge>
                  <CardTitle className="mt-2 text-xl">
                    Validate with LDAP
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm leading-7">
                    The login endpoint accepts <code>userId</code> and{" "}
                    <code>password</code>, binds against LDAP or LDAPS, then
                    creates the application JWT.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="mt-4 grid list-none gap-2 p-0 text-xs text-muted-foreground [&_li]:before:mr-2 [&_li]:before:text-primary [&_li]:before:content-['—']">
                    <li>Domain-aware usernames</li>
                    <li>Configurable server and port</li>
                    <li>LDAP error mapping</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="mt-10 gap-0 rounded-md border p-7 max-[760px]:mt-0">
                <CardHeader className="p-0">
                  <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <ShieldCheck size={20} />
                  </div>
                  <Badge
                    className="mt-5 tracking-wider uppercase"
                    variant="secondary"
                  >
                    Business Central
                  </Badge>
                  <CardTitle className="mt-2 text-xl">
                    Verify with LoginAsJson
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm leading-7">
                    The login endpoint accepts <code>email</code> and{" "}
                    <code>password</code>, calls <code>LoginAsJsonAsync</code>,
                    and verifies the returned hash.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="mt-4 grid list-none gap-2 p-0 text-xs text-muted-foreground [&_li]:before:mr-2 [&_li]:before:text-primary [&_li]:before:content-['—']">
                    <li>HMACSHA512 verification</li>
                    <li>Fixed-time hash comparison</li>
                    <li>Candidate number JWT claim</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-muted p-4 text-sm">
              <span className="rounded bg-primary px-2 py-1 font-mono text-[0.65rem] font-bold text-primary-foreground">
                POST
              </span>
              <code>/api/account/login</code>
              <p className="ml-auto text-xs text-muted-foreground max-[760px]:m-0 max-[760px]:w-full">
                Returns <code>ApiResponse&lt;TokenDto&gt;</code>
              </p>
            </div>
          </section>

          <section
            id="app-settings"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="05 — Settings"
              title="Configuration stays predictable"
              description="The base settings file stays minimal. Machine-specific BC, JWT, and AD values live in the development file or a secret provider."
            />
            <div className="grid grid-cols-[1.18fr_0.82fr] gap-4 max-[760px]:grid-cols-1 [&>div]:min-w-0 [&_h3]:mb-1 [&_h3]:text-base [&>div>p]:mb-3 [&>div>p]:text-xs [&>div>p]:text-muted-foreground">
              <div>
                <h3>appsettings.json</h3>
                <p>Safe defaults committed with the project.</p>
                <CodeBlock label="json">{appSettingsExample}</CodeBlock>
              </div>
              <div>
                <h3>appsettings.Development.json</h3>
                <p>Generated locally with empty credential fields.</p>
                <ul className="m-0 grid list-none rounded-xl border bg-card p-0 [&_li]:border-b [&_li]:px-4 [&_li]:py-3.5 [&_li]:text-xs [&_li]:text-muted-foreground [&_li:last-child]:border-b-0">
                  <li>
                    <code>AppSettings:ODATA_URI</code>
                  </li>
                  <li>
                    <code>AppSettings:PORTAL_CODEUNIT_URI</code>
                  </li>
                  <li>
                    <code>AppSettings:W_USER / W_PWD / DOMAIN</code>
                  </li>
                  <li>
                    <code>TokenKey / JwtSettings</code>
                  </li>
                  <li>
                    <code>ActiveDirectory</code> when selected
                  </li>
                </ul>
              </div>
            </div>
            <Alert className="mt-4 gap-x-3 border-warning/30 bg-warning-background text-warning-foreground [&_[data-slot=alert-description]]:text-warning-foreground">
              <KeyRound size={18} />
              <AlertTitle>Protect secrets</AlertTitle>
              <AlertDescription>
                Keep passwords and signing keys out of committed configuration.
                Use environment variables, .NET user secrets, or your deployment
                secret store.
              </AlertDescription>
            </Alert>
          </section>

          <section
            id="project-structure"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="06 — Output"
              title="A complete solution"
              description="The output includes the Visual Studio solution, server architecture, configured client, launcher, and a record of the selected generator options."
            />
            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(17rem,0.9fr)] items-start gap-5 max-[760px]:grid-cols-1">
              <CodeBlock label="generated files">{projectTree}</CodeBlock>
              <div className="grid gap-3 pt-8 max-[760px]:pt-0 [&>div]:grid [&>div]:grid-cols-[auto_1fr] [&>div]:gap-3 [&>div]:border-l-2 [&>div]:border-input [&>div]:bg-card [&>div]:p-4 [&_svg]:text-primary [&_p]:m-0 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-muted-foreground [&_strong]:mb-1 [&_strong]:block [&_strong]:text-foreground">
                <div>
                  <FileCode2 size={19} />
                  <p>
                    <strong>Server</strong>Controllers, services, DTOs,
                    integration helpers, middleware, and Scalar setup.
                  </p>
                </div>
                <div>
                  <Code2 size={19} />
                  <p>
                    <strong>Client</strong>React, TypeScript, Vite, optional
                    TanStack Query, Tailwind, and shadcn/ui.
                  </p>
                </div>
                <div>
                  <Clipboard size={19} />
                  <p>
                    <strong>Selection record</strong>
                    <code>bc-team-starter.json</code> records the non-secret
                    options used to create the project.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="cli-options"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="07 — CLI"
              title="Commands and options"
              description="Use interactive mode for a guided setup or provide defaults and configuration for repeatable generation."
            />
            <CodeBlock label="terminal">{`bc-intergration-starter [project-name] [options]`}</CodeBlock>
            <div className="mt-4 border-t [&>div]:grid [&>div]:grid-cols-[minmax(11rem,0.3fr)_1fr] [&>div]:gap-4 [&>div]:border-b [&>div]:py-3.5 [&_code]:text-xs [&_code]:font-semibold [&_code]:text-primary [&_p]:m-0 [&_p]:text-sm [&_p]:text-muted-foreground max-[760px]:[&>div]:grid-cols-1 max-[760px]:[&>div]:gap-1">
              <div>
                <code>-y, --yes</code>
                <p>Generate with defaults and skip prompts.</p>
              </div>
              <div>
                <code>--config &lt;file&gt;</code>
                <p>Read non-secret generator options from JSON.</p>
              </div>
              <div>
                <code>--output &lt;dir&gt;</code>
                <p>Select the parent directory for the generated project.</p>
              </div>
              <div>
                <code>-h, --help</code>
                <p>Print command usage and available options.</p>
              </div>
              <div>
                <code>-v, --version</code>
                <p>Print the installed package version.</p>
              </div>
            </div>
            <h3 className="mt-10 mb-2 text-base">Configuration file</h3>
            <CodeBlock label="starter.json">{configExample}</CodeBlock>
          </section>

          <section
            id="run-project"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="08 — Run"
              title="Start API and client together"
              description="The Windows launcher and Visual Studio profile are generated to match the workflow used by the team portals."
            />
            <div className="grid grid-cols-[0.72fr_1.28fr] overflow-hidden rounded-xl border bg-card max-[760px]:grid-cols-1">
              <div className="flex items-center gap-3 bg-primary p-6 text-primary-foreground">
                <Play size={20} />
                <div className="grid gap-1">
                  <span className="text-xs opacity-70">Windows</span>
                  <code className="font-mono text-base text-primary-foreground">
                    run.cmd
                  </code>
                </div>
              </div>
              <div className="grid grid-cols-2 p-3 [&_p]:m-0 [&_p]:flex [&_p]:items-center [&_p]:gap-2 [&_p]:p-3 [&_p]:text-xs [&_p]:text-muted-foreground [&_svg]:shrink-0 [&_svg]:text-primary max-[760px]:grid-cols-1">
                <p>
                  <Check size={15} /> Starts the ASP.NET Core API
                </p>
                <p>
                  <Check size={15} /> Opens a CMD window for the Vite client
                </p>
                <p>
                  <Check size={15} /> Waits for the health endpoint
                </p>
                <p>
                  <Check size={15} /> Opens Scalar at{" "}
                  <code>localhost:5080/scalar</code>
                </p>
              </div>
            </div>
          </section>

          <section
            id="troubleshooting"
            className="scroll-mt-8 border-t py-10 pt-28 max-[760px]:pt-20"
          >
            <SectionHeading
              eyebrow="09 — Help"
              title="Common first-run fixes"
              description="Most setup issues come from the connected service, credentials, or a Business Central URL that does not match the published service."
            />
            <div className="border-t [&_details]:border-b [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:py-4 [&_summary]:text-sm [&_summary]:font-semibold [&_summary]:after:float-right [&_summary]:after:font-mono [&_summary]:after:font-normal [&_summary]:after:text-muted-foreground [&_summary]:after:content-['+'] [&_details[open]_summary]:after:content-['−'] [&_details_p]:mt-0 [&_details_p]:mb-5 [&_details_p]:max-w-[70ch] [&_details_p]:text-sm [&_details_p]:leading-7 [&_details_p]:text-muted-foreground">
              <details open>
                <summary>Visual Studio cannot find the NAVWS types</summary>
                <p>
                  Add the WCF Web Service Reference using the codeunit URL plus{" "}
                  <code>?wsdl</code>, and name the namespace <code>NAVWS</code>.
                  If the generated client class differs, update its type in{" "}
                  <code>Credentials.cs</code>.
                </p>
              </details>
              <details>
                <summary>The API stops during startup</summary>
                <p>
                  When JWT is enabled, configure a random <code>TokenKey</code>{" "}
                  containing at least 64 UTF-8 bytes. For AD projects, also set
                  the directory server, domain, port, and LDAPS choice.
                </p>
              </details>
              <details>
                <summary>Business Central returns 401 or 403</summary>
                <p>
                  Check the selected BC authentication mode and the service
                  account values. Basic authentication requires HTTPS. NTLM and
                  Windows modes also require the correct domain.
                </p>
              </details>
              <details>
                <summary>The React client runs but sample records fail</summary>
                <p>
                  Start the ASP.NET Core API and verify the published OData page
                  name. The client keeps the error visible and plays the bundled
                  faah sound when the API is unavailable.
                </p>
              </details>
            </div>
          </section>
        </article>

        <footer className="mx-auto mt-20 flex w-[min(calc(100%_-_3rem),72rem)] items-center justify-between border-t py-8 text-xs text-muted-foreground max-[760px]:w-[min(calc(100%_-_2rem),42rem)] max-[760px]:items-start max-[760px]:gap-4 max-[520px]:w-[min(calc(100%_-_1.4rem),42rem)] max-[520px]:flex-col [&>div]:flex [&>div]:items-center [&>div]:gap-2.5 [&_p]:m-0 [&_strong]:block [&_a]:font-semibold [&_a]:text-primary [&_a]:no-underline">
          <div>
            <span className="grid size-8 place-items-center rounded-[0.65rem_0.65rem_0.25rem_0.65rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Database size={15} />
            </span>
            <p>
              <strong>BC Starter</strong>
              <span>ASP.NET Core + React for Business Central</span>
            </p>
          </div>
          <p>
            Cooked by{" "}
            <a
              href="https://nobertdev.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Nobert.Dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
