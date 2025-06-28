"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Search, ArrowLeft, Copy, Download, Eye } from "lucide-react";

export default function GitHubReadmeGenerator() {
  const [currentStep, setCurrentStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    currentWork: "",
    currentProject: "",
    currentProjectLink: "",
    collaboration: "",
    collaborationProject: "",
    collaborationLink: "",
    helpWith: "",
    helpProject: "",
    helpLink: "",
    learning: "",
    learningDetails: "",
    askAbout: "",
    askDetails: "",
    reachMe: "",
    reachDetails: "",
    portfolio: "",
    portfolioLink: "",
    blog: "",
    blogLink: "",
    resume: "",
    resumeLink: "",
    funFact: "",
  });

  const [workLabels, setWorkLabels] = useState({
    currentWork: "🔭 I'm currently working on",
    collaboration: "👯 I'm looking to collaborate on",
    helpWith: "🤝 I'm looking for help with",
    learning: "🌱 I'm currently learning",
    askAbout: "💬 Ask me about",
    reachMe: "📫 How to reach me",
    portfolio: "👨‍💻 All of my projects are available at",
    blog: "📝 I regularly write articles on",
    resume: "📄 Know about my experiences",
    funFact: "⚡ Fun fact",
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addonErrors, setAddonErrors] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    twitter: "",
    devto: "",
    codepen: "",
    codesandbox: "",
    stackoverflow: "",
    kaggle: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    dribbble: "",
    behance: "",
    hashnode: "",
    medium: "",
    youtube: "",
    codechef: "",
    hackerrank: "",
    codeforces: "",
    leetcode: "",
    topcoder: "",
    hackerearth: "",
    gfg: "",
    discord: "",
    rss: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWorkLabelChange = (field: string, value: string) => {
    setWorkLabels((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = useCallback((skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }, []);

  const handleAddonToggle = useCallback(
    (addon: string) => {
      // Check if addon requires social links
      const socialRequiredAddons = [
        "display twitter badge",
        "display latest dev.to blogs dynamically (GitHub Action)",
        "display latest medium blogs dynamically (GitHub Action)",
      ];

      if (socialRequiredAddons.includes(addon)) {
        let hasError = false;
        if (addon.includes("twitter") && !socialLinks.twitter) {
          hasError = true;
        }
        if (addon.includes("dev.to") && !socialLinks.devto) {
          hasError = true;
        }
        if (addon.includes("medium") && !socialLinks.medium) {
          hasError = true;
        }

        if (hasError) {
          setAddonErrors((prev) => [...prev, addon]);
          return;
        } else {
          setAddonErrors((prev) => prev.filter((error) => error !== addon));
        }
      }

      setSelectedAddons((prev) =>
        prev.includes(addon)
          ? prev.filter((a) => a !== addon)
          : [...prev, addon]
      );
    },
    [socialLinks.twitter, socialLinks.devto, socialLinks.medium]
  );

  const handleSocialChange = (platform: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
    // Clear related addon errors when social link is filled
    setAddonErrors((prev) => prev.filter((error) => !error.includes(platform)));
  };

  const handleTweetClick = () => {
    const tweetText =
      "Wow! You should use this README generator! It's amazing for creating GitHub profiles.";
    const url = "yasirkhan.xyz";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedMarkdown);
      alert("Markdown copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generatedMarkdown;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Markdown copied to clipboard!");
    }
  };

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedMarkdown], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "README.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateMarkdown = () => {
    let markdown = `<h1 align="center">Hi 👋, I'm ${formData.name}</h1>\n`;
    markdown += `<h3 align="center">${formData.subtitle}</h3>\n\n`;

    if (formData.currentProject) {
      markdown += `${workLabels.currentWork} **${formData.currentProject}**\n\n`;
    }

    if (formData.collaborationProject) {
      markdown += `${workLabels.collaboration} **${formData.collaborationProject}**\n\n`;
    }

    if (formData.helpProject) {
      markdown += `${workLabels.helpWith} **${formData.helpProject}**\n\n`;
    }

    if (formData.learningDetails) {
      markdown += `${workLabels.learning} **${formData.learningDetails}**\n\n`;
    }

    if (formData.askDetails) {
      markdown += `${workLabels.askAbout} **${formData.askDetails}**\n\n`;
    }

    if (formData.reachDetails) {
      markdown += `${workLabels.reachMe} **${formData.reachDetails}**\n\n`;
    }

    if (formData.portfolioLink) {
      markdown += `${workLabels.portfolio} [${formData.portfolioLink}](${formData.portfolioLink})\n\n`;
    }

    if (formData.blogLink) {
      markdown += `${workLabels.blog} [${formData.blogLink}](${formData.blogLink})\n\n`;
    }

    if (formData.resumeLink) {
      markdown += `${workLabels.resume} [${formData.resumeLink}](${formData.resumeLink})\n\n`;
    }

    if (formData.funFact) {
      markdown += `${workLabels.funFact} **${formData.funFact}**\n\n`;
    }

    // Add social links
    markdown += `<h3 align="left">Connect with me:</h3>\n<p align="left">\n`;
    Object.entries(socialLinks).forEach(([platform, username]) => {
      if (username) {
        markdown += `<a href="https://${platform}.com/${username}" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/${platform}.svg" alt="${username}" height="30" width="40" /></a>\n`;
      }
    });
    markdown += `</p>\n\n`;

    // Add skills
    if (selectedSkills.length > 0) {
      markdown += `<h3 align="left">Languages and Tools:</h3>\n<p align="left">`;
      selectedSkills.forEach((skill) => {
        markdown += ` <a href="#" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/${skill.toLowerCase()}/${skill.toLowerCase()}-original.svg" alt="${skill}" width="40" height="40"/> </a>`;
      });
      markdown += `</p>\n\n`;
    }

    setGeneratedMarkdown(markdown);
    setCurrentStep("output");
  };

  const programmingLanguages = [
    { name: "C", icon: "🔵" },
    { name: "C++", icon: "🔵" },
    { name: "C#", icon: "🟣" },
    { name: "Go", icon: "🔵" },
    { name: "Java", icon: "☕" },
    { name: "JavaScript", icon: "🟨" },
    { name: "TypeScript", icon: "🔷" },
    { name: "PHP", icon: "🟣" },
    { name: "Swift", icon: "🔶" },
    { name: "Objective-C", icon: "⚫" },
    { name: "Scala", icon: "🔴" },
    { name: "Python", icon: "🐍" },
    { name: "Haxe", icon: "🟠" },
    { name: "CoffeeScript", icon: "🟤" },
    { name: "Elixir", icon: "🟣" },
    { name: "Erlang", icon: "🔴" },
    { name: "Clojure", icon: "🟢" },
    { name: "Rust", icon: "🦀" },
  ];

  const frontendDev = [
    { name: "Vue.js", icon: "🟢" },
    { name: "React", icon: "⚛️" },
    { name: "Svelte", icon: "🔶" },
    { name: "Angular", icon: "🔴" },
    { name: "CSS3", icon: "🔷" },
    { name: "HTML5", icon: "🟠" },
    { name: "Pug", icon: "🟤" },
    { name: "Sass", icon: "🌸" },
    { name: "Tailwind", icon: "🔷" },
    { name: "Material-UI", icon: "🔷" },
    { name: "Bootstrap", icon: "🟣" },
    { name: "Vuetify", icon: "🔷" },
    { name: "Quasar", icon: "🔷" },
    { name: "Bulma", icon: "🟢" },
    { name: "Semantic UI", icon: "🟢" },
    { name: "Webpack", icon: "🔷" },
    { name: "Babel", icon: "🟨" },
    { name: "Gulp", icon: "🔴" },
  ];

  const backendDev = [
    { name: "Node.js", icon: "🟢" },
    { name: "Spring", icon: "🟢" },
    { name: "Express", icon: "⚫" },
    { name: "GraphQL", icon: "🌸" },
    { name: "Kafka", icon: "⚫" },
    { name: "Solr", icon: "🟠" },
    { name: "Nginx", icon: "🟢" },
    { name: "Apache", icon: "🔴" },
    { name: "Jenkins", icon: "🔵" },
    { name: "NestJS", icon: "🔴" },
  ];

  const mobileAppDev = [
    { name: "Android", icon: "🟢" },
    { name: "Flutter", icon: "🔷" },
    { name: "Dart", icon: "🔷" },
    { name: "Kotlin", icon: "🟣" },
    { name: "NativeScript", icon: "🔵" },
    { name: "Xamarin", icon: "🔷" },
    { name: "React Native", icon: "⚛️" },
    { name: "Ionic", icon: "🔷" },
    { name: "Appcelerator", icon: "🔴" },
  ];

  const aiMl = [
    { name: "TensorFlow", icon: "🟠" },
    { name: "PyTorch", icon: "🔥" },
    { name: "Pandas", icon: "🐼" },
    { name: "Scikit-learn", icon: "🟠" },
    { name: "OpenCV", icon: "🔵" },
  ];

  const database = [
    { name: "MongoDB", icon: "🟢" },
    { name: "MySQL", icon: "🔷" },
    { name: "PostgreSQL", icon: "🔷" },
    { name: "Redis", icon: "🔴" },
    { name: "Oracle", icon: "🔴" },
    { name: "Cassandra", icon: "🟡" },
    { name: "CouchDB", icon: "🔴" },
    { name: "Hive", icon: "🟡" },
    { name: "Realm", icon: "🟣" },
    { name: "SQLite", icon: "🔷" },
    { name: "MS SQL", icon: "🔴" },
    { name: "Elasticsearch", icon: "🟡" },
  ];

  const devops = [
    { name: "AWS", icon: "🟠" },
    { name: "Docker", icon: "🔷" },
    { name: "Jenkins", icon: "⚫" },
    { name: "GCP", icon: "🔵" },
    { name: "Kubernetes", icon: "🔷" },
    { name: "Bash", icon: "⚫" },
    { name: "Azure", icon: "🔷" },
    { name: "Vagrant", icon: "🔷" },
    { name: "CircleCI", icon: "⚫" },
    { name: "TravisCI", icon: "🟡" },
  ];

  const dataVisualization = [
    { name: "D3.js", icon: "🟠" },
    { name: "Chart.js", icon: "🌸" },
    { name: "Canva", icon: "🔷" },
    { name: "Kibana", icon: "🔷" },
    { name: "Grafana", icon: "🟠" },
  ];

  const baas = [
    { name: "Firebase", icon: "🟡" },
    { name: "Amplify", icon: "🟠" },
    { name: "Appwrite", icon: "🌸" },
    { name: "Heroku", icon: "🟣" },
  ];

  const framework = [
    { name: "Django", icon: "🟢" },
    { name: ".NET", icon: "🟣" },
    { name: "Laravel", icon: "🔴" },
    { name: "Symfony", icon: "⚫" },
    { name: "CodeIgniter", icon: "🔥" },
    { name: "Rails", icon: "🔴" },
    { name: "Flask", icon: "⚫" },
    { name: "Electron", icon: "🔷" },
  ];

  const testing = [
    { name: "Cypress", icon: "⚫" },
    { name: "Selenium", icon: "🟢" },
    { name: "Jest", icon: "🔴" },
    { name: "Mocha", icon: "🟤" },
    { name: "Puppeteer", icon: "🟢" },
    { name: "Karma", icon: "🟢" },
    { name: "Jasmine", icon: "🟣" },
  ];

  const software = [
    { name: "Illustrator", icon: "🟠" },
    { name: "Photoshop", icon: "🔷" },
    { name: "XD", icon: "🌸" },
    { name: "Figma", icon: "🎨" },
    { name: "Blender", icon: "🟠" },
    { name: "Sketch", icon: "🟡" },
    { name: "InVision", icon: "🌸" },
    { name: "Framer", icon: "🔷" },
  ];

  const staticSiteGenerators = [
    { name: "Gatsby", icon: "🟣" },
    { name: "GridSome", icon: "🟢" },
    { name: "Hugo", icon: "🌸" },
    { name: "Jekyll", icon: "🔴" },
    { name: "Next.js", icon: "⚫" },
    { name: "Nuxt", icon: "🟢" },
    { name: "11ty", icon: "⚫" },
    { name: "Scully", icon: "🔴" },
    { name: "Sapper", icon: "🔥" },
    { name: "VuePress", icon: "🟢" },
    { name: "Hexo", icon: "🔷" },
  ];

  const gameEngines = [
    { name: "Unity", icon: "⚫" },
    { name: "Unreal Engine", icon: "⚫" },
  ];

  const automation = [
    { name: "Zapier", icon: "🟠" },
    { name: "IFTTT", icon: "🔷" },
  ];

  const other = [
    { name: "Linux", icon: "🐧" },
    { name: "Git", icon: "🔶" },
    { name: "Arduino", icon: "🔷" },
  ];

  const addons = [
    "display visitors count badge 👁️",
    "display github trophy",
    "display github profile stats card 📊",
    "display top skills 📊",
    "display github streak stats 🔥",
    "display twitter badge",
    "display latest dev.to blogs dynamically (GitHub Action)",
    "display latest medium blogs dynamically (GitHub Action)",
    "display latest blogs from your personal blog dynamically (GitHub Action)",
  ];

  const SkillSection = ({
    title,
    skills,
  }: {
    title: string;
    skills: Array<{ name: string; icon: string }>;
  }) => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-3">
        {title}
      </h3>
      <div className="grid grid-cols-4 gap-6">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center space-x-3">
            <Checkbox
              id={skill.name}
              checked={selectedSkills.includes(skill.name)}
              onCheckedChange={() => handleSkillToggle(skill.name)}
              className="w-5 h-5"
            />
            <span className="text-3xl">{skill.icon}</span>
            <Label
              htmlFor={skill.name}
              className="text-base cursor-pointer font-medium"
            >
              {skill.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  const socialPlatforms = [
    {
      key: "github",
      name: "GitHub",
      icon: "⚫",
      placeholder: "github username",
    },
    {
      key: "twitter",
      name: "Twitter",
      icon: "🐦",
      placeholder: "twitter username",
    },
    {
      key: "devto",
      name: "Dev.to",
      icon: "📝",
      placeholder: "dev.to username",
    },
    {
      key: "codepen",
      name: "CodePen",
      icon: "✏️",
      placeholder: "codepen username",
    },
    {
      key: "codesandbox",
      name: "CodeSandbox",
      icon: "📦",
      placeholder: "codesandbox username",
    },
    {
      key: "stackoverflow",
      name: "Stack Overflow",
      icon: "📚",
      placeholder: "stackoverflow user ID",
    },
    {
      key: "kaggle",
      name: "Kaggle",
      icon: "🏆",
      placeholder: "kaggle username",
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      placeholder: "linkedin username",
    },
    {
      key: "facebook",
      name: "Facebook",
      icon: "📘",
      placeholder: "facebook username",
    },
    {
      key: "instagram",
      name: "Instagram",
      icon: "📷",
      placeholder: "instagram username",
    },
    {
      key: "dribbble",
      name: "Dribbble",
      icon: "🎨",
      placeholder: "dribbble username",
    },
    {
      key: "behance",
      name: "Behance",
      icon: "🎭",
      placeholder: "behance username",
    },
    {
      key: "hashnode",
      name: "Hashnode",
      icon: "📰",
      placeholder: "hashnode username (with @)",
    },
    {
      key: "medium",
      name: "Medium",
      icon: "📖",
      placeholder: "medium username (with @)",
    },
    {
      key: "youtube",
      name: "YouTube",
      icon: "📺",
      placeholder: "youtube channel name",
    },
    {
      key: "codechef",
      name: "CodeChef",
      icon: "👨‍🍳",
      placeholder: "codechef username",
    },
    {
      key: "hackerrank",
      name: "HackerRank",
      icon: "🏅",
      placeholder: "hackerrank username",
    },
    {
      key: "codeforces",
      name: "Codeforces",
      icon: "⚔️",
      placeholder: "codeforces username",
    },
    {
      key: "leetcode",
      name: "LeetCode",
      icon: "🧩",
      placeholder: "leetcode username",
    },
    {
      key: "topcoder",
      name: "TopCoder",
      icon: "🏁",
      placeholder: "topcoder username",
    },
    {
      key: "hackerearth",
      name: "HackerEarth",
      icon: "🌍",
      placeholder: "hackerearth user (with @)",
    },
    {
      key: "gfg",
      name: "GeeksforGeeks",
      icon: "🤓",
      placeholder: "GFG (<username>/profile)",
    },
    {
      key: "discord",
      name: "Discord",
      icon: "💬",
      placeholder: "discord invite (only code)",
    },
    { key: "rss", name: "RSS", icon: "📡", placeholder: "RSS feed URL" },
  ];

  if (currentStep === "output") {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto p-6 max-w-full">
          <div className="bg-white border rounded-lg shadow-sm">
            {/* Action Buttons */}
            <div className="flex gap-3 p-6 border-b bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("form")}
                className="flex items-center gap-2 px-6 py-3 text-base"
              >
                <ArrowLeft className="w-5 h-5" />
                back to edit
              </Button>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-6 py-3 text-base bg-transparent"
              >
                <Copy className="w-5 h-5" />
                copy markdown
              </Button>
              <Button
                variant="outline"
                onClick={downloadMarkdown}
                className="flex items-center gap-2 bg-transparent px-6 py-3 text-base"
              >
                <Download className="w-5 h-5" />
                download markdown
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent px-6 py-3 text-base"
              >
                <Download className="w-5 h-5" />
                download backup
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent px-6 py-3 text-base"
              >
                <Eye className="w-5 h-5" />
                preview
              </Button>
            </div>

            {/* Generated Markdown */}
            <div className="p-6">
              <Textarea
                value={generatedMarkdown}
                readOnly
                className="w-full h-96 font-mono text-base"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10 max-w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-base text-gray-500 mb-3">mvG</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            GitHub Profile README Generator
          </h1>
        </div>

        <div className="space-y-12">
          {/* Profile Information */}
          <div className="bg-white border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8">Title</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <span className="text-lg">Hi 👋, I'm</span>
                <Input
                  placeholder="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="flex-1 border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-lg py-3 px-0"
                />
              </div>

              <h3 className="text-xl font-semibold mt-12">Subtitle</h3>
              <Input
                placeholder="A passionate frontend developer from India"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-lg py-3 px-0"
              />

              <h3 className="text-xl font-semibold mt-12">Work</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-8 items-center">
                  <Input
                    placeholder="🔭 I'm currently working on"
                    value={workLabels.currentWork}
                    onChange={(e) =>
                      handleWorkLabelChange("currentWork", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="project name"
                    value={formData.currentProject}
                    onChange={(e) =>
                      handleInputChange("currentProject", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                  <Input
                    placeholder="project link"
                    value={formData.currentProjectLink}
                    onChange={(e) =>
                      handleInputChange("currentProjectLink", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-8 items-center">
                  <Input
                    placeholder="👯 I'm looking to collaborate on"
                    value={workLabels.collaboration}
                    onChange={(e) =>
                      handleWorkLabelChange("collaboration", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="project name"
                    value={formData.collaborationProject}
                    onChange={(e) =>
                      handleInputChange("collaborationProject", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                  <Input
                    placeholder="project link"
                    value={formData.collaborationLink}
                    onChange={(e) =>
                      handleInputChange("collaborationLink", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-8 items-center">
                  <Input
                    placeholder="🤝 I'm looking for help with"
                    value={workLabels.helpWith}
                    onChange={(e) =>
                      handleWorkLabelChange("helpWith", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="project name"
                    value={formData.helpProject}
                    onChange={(e) =>
                      handleInputChange("helpProject", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                  <Input
                    placeholder="project link"
                    value={formData.helpLink}
                    onChange={(e) =>
                      handleInputChange("helpLink", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <Input
                    placeholder="🌱 I'm currently learning"
                    value={workLabels.learning}
                    onChange={(e) =>
                      handleWorkLabelChange("learning", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="Frameworks, courses etc."
                    value={formData.learningDetails}
                    onChange={(e) =>
                      handleInputChange("learningDetails", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <Input
                    placeholder="💬 Ask me about"
                    value={workLabels.askAbout}
                    onChange={(e) =>
                      handleWorkLabelChange("askAbout", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="react, vue and gsap"
                    value={formData.askDetails}
                    onChange={(e) =>
                      handleInputChange("askDetails", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <Input
                    placeholder="📫 How to reach me"
                    value={workLabels.reachMe}
                    onChange={(e) =>
                      handleWorkLabelChange("reachMe", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="example@gmail.com"
                    value={formData.reachDetails}
                    onChange={(e) =>
                      handleInputChange("reachDetails", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <Input
                    placeholder="👨‍💻 All of my projects are available at"
                    value={workLabels.portfolio}
                    onChange={(e) =>
                      handleWorkLabelChange("portfolio", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="portfolio link"
                    value={formData.portfolioLink}
                    onChange={(e) =>
                      handleInputChange("portfolioLink", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <Input
                    placeholder="📝 I regularly write articles on"
                    value={workLabels.blog}
                    onChange={(e) =>
                      handleWorkLabelChange("blog", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="blog link"
                    value={formData.blogLink}
                    onChange={(e) =>
                      handleInputChange("blogLink", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <Input
                    placeholder="📄 Know about my experiences"
                    value={workLabels.resume}
                    onChange={(e) =>
                      handleWorkLabelChange("resume", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="resume link"
                    value={formData.resumeLink}
                    onChange={(e) =>
                      handleInputChange("resumeLink", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <Input
                    placeholder="⚡ Fun fact"
                    value={workLabels.funFact}
                    onChange={(e) =>
                      handleWorkLabelChange("funFact", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <Input
                    placeholder="I think I am funny"
                    value={formData.funFact}
                    onChange={(e) =>
                      handleInputChange("funFact", e.target.value)
                    }
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white border rounded-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Skills</h2>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search Skills"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-80 border border-gray-300 text-base py-3"
                />
              </div>
            </div>
            <div className="space-y-10">
              <SkillSection
                title="Programming Languages"
                skills={programmingLanguages}
              />
              <SkillSection title="Frontend Development" skills={frontendDev} />
              <SkillSection title="Backend Development" skills={backendDev} />
              <SkillSection
                title="Mobile App Development"
                skills={mobileAppDev}
              />
              <SkillSection title="AI/ML" skills={aiMl} />
              <SkillSection title="Database" skills={database} />
              <SkillSection
                title="Data Visualization"
                skills={dataVisualization}
              />
              <SkillSection title="DevOps" skills={devops} />
              <SkillSection title="Backend as a Service(BaaS)" skills={baas} />
              <SkillSection title="Framework" skills={framework} />
              <SkillSection title="Testing" skills={testing} />
              <SkillSection title="Software" skills={software} />
              <SkillSection
                title="Static Site Generators"
                skills={staticSiteGenerators}
              />
              <SkillSection title="Game Engines" skills={gameEngines} />
              <SkillSection title="Automation" skills={automation} />
              <SkillSection title="Other" skills={other} />
            </div>
          </div>

          {/* Social Section */}
          <div className="bg-white border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8">Social</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                {socialPlatforms.slice(0, 12).map((platform) => (
                  <div key={platform.key} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                      <span className="text-lg">{platform.icon}</span>
                    </div>
                    <Input
                      placeholder={platform.placeholder}
                      value={
                        socialLinks[platform.key as keyof typeof socialLinks]
                      }
                      onChange={(e) =>
                        handleSocialChange(platform.key, e.target.value)
                      }
                      className="flex-1 border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                {socialPlatforms.slice(12).map((platform) => (
                  <div key={platform.key} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                      <span className="text-lg">{platform.icon}</span>
                    </div>
                    <Input
                      placeholder={platform.placeholder}
                      value={
                        socialLinks[platform.key as keyof typeof socialLinks]
                      }
                      onChange={(e) =>
                        handleSocialChange(platform.key, e.target.value)
                      }
                      className="flex-1 border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="bg-white border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8">Add-ons</h2>
            <div className="space-y-6">
              {addons.map((addon) => (
                <div key={addon} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={addon}
                      checked={selectedAddons.includes(addon)}
                      onCheckedChange={() => handleAddonToggle(addon)}
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor={addon}
                      className="text-base cursor-pointer font-medium"
                    >
                      {addon}
                    </Label>
                  </div>
                  {addonErrors.includes(addon) && (
                    <p className="text-red-500 text-sm ml-8">
                      Please fill in the required social media link first.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={generateMarkdown}
              className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-lg border border-gray-300"
            >
              Generate README
            </Button>
          </div>

          {/* Support Section - Redesigned */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Support This Project
                </h2>
                <span className="text-3xl">🙏</span>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Are you using this tool and happy with it to create your GitHub
                Profile?
              </p>
              <p className="text-base text-gray-600 mb-8">
                Your kind support keeps open-source tools like this free for
                others.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={handleTweetClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-base font-medium rounded-lg shadow-md"
                >
                  🐦 Share on Twitter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
