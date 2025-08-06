import { useState } from "react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const frameworks = [
  { id: "laravel", label: "Laravel" },
  { id: "codeigniter", label: "CodeIgniter" },
  { id: "react", label: "React" },
  { id: "node", label: "Node.js (Express)" },
  { id: "golang", label: "Go (Fiber)" },
];

const databases = [
  { id: "mysql", label: "MySQL" },
  { id: "postgres", label: "PostgreSQL" },
  { id: "sqlite", label: "SQLite" },
  { id: "mongodb", label: "MongoDB" },
];

function sanitize(name: string) {
  return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
}

export function Generator() {
  const [projectName, setProjectName] = useState("ai-starter");
  const [framework, setFramework] = useState<string>(frameworks[0].id);
  const [database, setDatabase] = useState<string>(databases[0].id);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const zip = new JSZip();
      const dirName = sanitize(projectName) || "ai-starter";
      const root = zip.folder(dirName)!;

      const readme = `# ${projectName}\n\nGenerated with AI Builder.\n\n- Framework: ${framework}\n- Database: ${database}\n\n## Quickstart\n\nSee framework folder for setup instructions.\n`;
      root.file("README.md", readme);
      root.file(".gitignore", `node_modules\n.env\nvendor\n.DS_Store\n`);

      // Common env hints
      root.file(".env.example", `DATABASE_URL=\nDB_HOST=localhost\nDB_USER=user\nDB_PASS=pass\nDB_NAME=${sanitize(projectName)}\n`);

      switch (framework) {
        case "react":
          addReact(root, database, dirName);
          break;
        case "node":
          addNode(root, database, dirName);
          break;
        case "golang":
          addGo(root, database, dirName);
          break;
        case "laravel":
          addLaravel(root, database);
          break;
        case "codeigniter":
          addCodeIgniter(root, database);
          break;
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dirName}-${framework}-${database}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <CardHeader>
        <CardTitle>Generate project</CardTitle>
        <CardDescription>
          Pilih framework, database, dan unduh paket boilerplate siap mulai.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="name">Nama Proyek</Label>
          <Input id="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="my-awesome-app" />
        </div>
        <div className="grid gap-2">
          <Label>Framework</Label>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih framework" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Database</Label>
          <Select value={database} onValueChange={setDatabase}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih database" />
            </SelectTrigger>
            <SelectContent>
              {databases.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? "Mempersiapkan zip…" : "Generate & Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function addReact(root: JSZip, database: string, dir: string) {
  const app = root.folder("react-app")!;
  app.file("package.json", JSON.stringify({
    name: `${dir}-react`,
    private: true,
    scripts: { start: "vite", build: "vite build", preview: "vite preview" },
    dependencies: { react: "^18.3.1", "react-dom": "^18.3.1" },
    devDependencies: { vite: "^5.4.0" },
  }, null, 2));
  app.file("index.html", `<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>${dir} React</title></head><body><div id=\"root\"></div><script type=\"module\">import React from 'react';import {createRoot} from 'react-dom/client';createRoot(document.getElementById('root')).render(React.createElement('h1', null, 'Hello React + ${database}'));</script></body></html>`);
}

function addNode(root: JSZip, database: string, dir: string) {
  const node = root.folder("node-express")!;
  const dbSnippet: Record<string, string> = {
    mysql: "// npm i mysql2\nconst mysql = require('mysql2/promise');\n(async () => { await mysql.createConnection({host:'localhost',user:'user',database:'db'}); })();",
    postgres: "// npm i pg\nconst { Client } = require('pg');\n(async () => { const client = new Client(); await client.connect(); })();",
    sqlite: "// npm i better-sqlite3\nconst Database = require('better-sqlite3');\nnew Database('db.sqlite');",
    mongodb: "// npm i mongodb\nconst { MongoClient } = require('mongodb');\n(async () => { const client = new MongoClient('mongodb://localhost:27017'); await client.connect(); })();",
  };
  node.file("package.json", JSON.stringify({
    name: `${dir}-api`,
    private: true,
    type: "module",
    scripts: { start: "node index.js" },
    dependencies: { express: "^4.19.2" },
  }, null, 2));
  node.file("index.js", `import express from 'express';\nconst app = express();\napp.get('/', (req, res) => res.json({ ok: true }));\napp.listen(3000, () => console.log('API ready on :3000'));\n// Database setup example:\n${dbSnippet[database]}`);
}

function addGo(root: JSZip, database: string, dir: string) {
  const go = root.folder("go-fiber")!;
  go.file("go.mod", `module ${dir}\n\ngo 1.22\n\nrequire github.com/gofiber/fiber/v2 v2.52.1`);
  go.file("main.go", `package main\n\nimport (\n  \"github.com/gofiber/fiber/v2\"\n)\n\nfunc main() {\n  app := fiber.New()\n  app.Get(\"/\", func(c *fiber.Ctx) error {\n    return c.JSON(fiber.Map{\"ok\": true})\n  })\n  // DB (${database}) connection snippet goes here\n  app.Listen(\":3000\")\n}`);
}

function addLaravel(root: JSZip, database: string) {
  const laravel = root.folder("laravel-skeleton")!;
  laravel.file("composer.json", JSON.stringify({ name: "ai/laravel-skeleton", require: { "laravel/framework": "^11.0" } }, null, 2));
  laravel.file("routes/web.php", "<?php\nuse Illuminate\\Support\\Facades\\Route;\nRoute::get('/', fn() => 'Hello Laravel + "+database+"');\n");
  laravel.file(".env.example", `DB_CONNECTION=${database === 'postgres' ? 'pgsql' : database}\nDB_HOST=127.0.0.1\nDB_PORT=${database === 'mysql' ? '3306' : database === 'postgres' ? '5432' : '3306'}\nDB_DATABASE=app\nDB_USERNAME=root\nDB_PASSWORD=\n`);
}

function addCodeIgniter(root: JSZip, database: string) {
  const ci = root.folder("codeigniter-skeleton")!;
  ci.file("index.php", "<?php echo 'Hello CodeIgniter + "+database+"'; ");
  ci.file("application/config/database.php", `<?php\n$active_group = 'default';\n$query_builder = TRUE;\n$db['default'] = array(\n  'dsn'   => '',\n  'hostname' => 'localhost',\n  'username' => 'root',\n  'password' => '',\n  'database' => 'app',\n  'dbdriver' => '${database === 'postgres' ? 'postgre' : database}',\n);`);
}
