import Image from "next/image";

const owner = "nour kidoudi";

const certifications = [
  { title: "AWS Cloud Practitioner", year: "2024" },
  { title: "Docker Certified Associate", year: "2024" },
  { title: "Kubernetes CKAD", year: "2025" },
];

const projects = [
  {
    title: "CI/CD Pipeline Automation",
    description:
      "Mise en place d'un pipeline CI/CD complet avec GitHub Actions, Docker et Kubernetes pour le déploiement continu d'applications microservices.",
    tags: ["GitHub Actions", "Docker", "Kubernetes"],
  },
  {
    title: "Infrastructure as Code avec Terraform",
    description:
      "Provisionnement automatisé d'infrastructure cloud (AWS) avec Terraform et Ansible pour une architecture haute disponibilité.",
    tags: ["Terraform", "AWS", "Ansible"],
  },
  {
    title: "Monitoring & Observabilité",
    description:
      "Déploiement d'une stack de monitoring complète avec Prometheus, Grafana et alerting pour des applications en production.",
    tags: ["Prometheus", "Grafana", "Alertmanager"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {owner
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {owner}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-1">
              Ingénieur DevOps & Cloud
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* À propos */}
        <section>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            À propos
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Passionné par le DevOps et le Cloud Engineering, je conçois et
            automatise des plateformes modernes pour accélérer le cycle de vie
            des applications. Expert en conteneurisation, orchestration et
            CI/CD, je mets en œuvre les meilleures pratiques pour des
            déploiements fiables et reproductibles.
          </p>
        </section>

        {/* Certifications */}
        <section>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            🎓 Certifications
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {certifications.map((cert) => (
              <div
                key={cert.title}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {cert.title}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                  {cert.year}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Projets DevOps & Cloud */}
        <section>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            🚀 Projets DevOps & Cloud
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.title}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {project.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compétences */}
        <section>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            🛠 Compétences
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Docker",
              "Kubernetes",
              "Terraform",
              "GitHub Actions",
              "GitLab CI",
              "AWS",
              "Azure",
              "Ansible",
              "Prometheus",
              "Grafana",
              "Linux",
              "Backstage",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-zinc-200 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>
            © {new Date().getFullYear()} {owner} — Portfolio généré avec{" "}
            <a
              href="https://backstage.io"
              className="underline hover:text-zinc-900 dark:hover:text-zinc-300"
            >
              Backstage
            </a>{" "}
            &{" "}
            <a
              href="https://nextjs.org"
              className="underline hover:text-zinc-900 dark:hover:text-zinc-300"
            >
              Next.js
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
