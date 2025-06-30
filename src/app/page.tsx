"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Search, ArrowLeft, Copy, Download, Eye } from "lucide-react";
import { skillCategories, skillIcons, type Skill } from "@/data/skills";
import Navbar from "@/components/navbar";

// Memoized skill item component for better performance
const SkillItem = memo(
  ({
    skill,
    isSelected,
    onToggle,
  }: {
    skill: Skill;
    isSelected: boolean;
    onToggle: (skillKey: string) => void;
  }) => {
    const iconUrl = skillIcons[skill.key as keyof typeof skillIcons];

    return (
      <div className="flex items-center gap-3">
        <Checkbox
          id={skill.key}
          checked={isSelected}
          onCheckedChange={() => onToggle(skill.key)}
          className="w-4 h-4"
        />
        <div
          className="relative group cursor-pointer"
          onClick={() => onToggle(skill.key)}
        >
          <img
            src={iconUrl || "/placeholder.svg"}
            alt={skill.name}
            className="w-12 h-12 object-contain hover:scale-125 transition-transform duration-300"
            loading="lazy"
          />
          {/* Fixed Tooltip - Only shows one skill name */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
            {skill.name}
          </div>
        </div>
      </div>
    );
  }
);

SkillItem.displayName = "SkillItem";

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

  // Optimized input handlers with debouncing
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleWorkLabelChange = useCallback((field: string, value: string) => {
    setWorkLabels(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSkillToggle = useCallback((skillKey: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillKey)
        ? prev.filter(s => s !== skillKey)
        : [...prev, skillKey]
    );
  }, []);

  const handleAddonToggle = useCallback(
    (addon: string) => {
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
          setAddonErrors(prev => [...prev, addon]);
          return;
        } else {
          setAddonErrors(prev => prev.filter(error => error !== addon));
        }
      }

      setSelectedAddons(prev =>
        prev.includes(addon)
          ? prev.filter(a => a !== addon)
          : [...prev, addon]
      );
    },
    [socialLinks.twitter, socialLinks.devto, socialLinks.medium]
  );

  const handleSocialChange = useCallback((platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
    setAddonErrors(prev => prev.filter(error => !error.includes(platform)));
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedMarkdown);
      alert("Markdown copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      const textArea = document.createElement("textarea");
      textArea.value = generatedMarkdown;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Markdown copied to clipboard!");
    }
  }, [generatedMarkdown]);

  const downloadMarkdown = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([generatedMarkdown], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "README.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [generatedMarkdown]);

  const generateMarkdown = useCallback(() => {
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
      selectedSkills.forEach((skillKey) => {
        const iconUrl = skillIcons[skillKey as keyof typeof skillIcons];
        if (iconUrl) {
          markdown += ` <a href="#" target="_blank" rel="noreferrer"> <img src="${iconUrl}" alt="${skillKey}" width="40" height="40"/> </a>`;
        }
      });
      markdown += `</p>\n\n`;
    }

    setGeneratedMarkdown(markdown);
    setCurrentStep("output");
  }, [formData, workLabels, socialLinks, selectedSkills]);

  // Memoized filtered skills for search performance
  const filteredSkillCategories = useMemo(() => {
    if (!searchTerm) return skillCategories;

    const filtered: typeof skillCategories = {} as typeof skillCategories;

    Object.entries(skillCategories).forEach(([categoryKey, skills]) => {
      const filteredSkills = skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredSkills.length > 0) {
        filtered[categoryKey as keyof typeof skillCategories] = filteredSkills;
      }
    });

    return filtered;
  }, [searchTerm, skillCategories]);

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

  const SkillSection = memo(
    ({ title, skills }: { title: string; skills: Skill[] }) => (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-3">
          {title}
        </h3>
        <div className="grid grid-cols-4 gap-8">
          {skills.map((skill) => (
            <SkillItem
              key={skill.key}
              skill={skill}
              isSelected={selectedSkills.includes(skill.key)}
              onToggle={handleSkillToggle}
            />
          ))}
        </div>
      </div>
    )
  );

  SkillSection.displayName = "SkillSection";

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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circles */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-pink-400 rounded-full opacity-60 animate-float-slow"></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-50 animate-float-medium"></div>
        <div className="absolute top-48 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-70 animate-float-fast"></div>
        <div className="absolute top-64 right-1/3 w-5 h-5 bg-blue-400 rounded-full opacity-40 animate-float-slow"></div>
        <div className="absolute top-80 left-1/2 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-float-medium"></div>
        <div className="absolute top-96 right-10 w-4 h-4 bg-red-400 rounded-full opacity-50 animate-float-fast"></div>

        {/* Triangles */}
        <div className="absolute top-24 right-1/4 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-pink-400 opacity-60 animate-float-medium"></div>
        <div className="absolute top-40 left-1/3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-purple-400 opacity-50 animate-float-slow"></div>
        <div className="absolute top-56 right-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[17px] border-l-transparent border-r-transparent border-b-yellow-400 opacity-70 animate-float-fast"></div>
        <div className="absolute top-72 left-20 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[12px] border-l-transparent border-r-transparent border-b-blue-400 opacity-40 animate-float-medium"></div>
        <div className="absolute top-88 right-1/5 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-green-400 opacity-60 animate-float-slow"></div>
      </div>

      <div className="container mx-auto px-8 py-10 max-w-7xl relative z-10">
        {/* Header */}
        <Navbar />
        <div className="text-center mb-16 pt-8">
          <div className="relative inline-block">
            {/* Main Heading with Premium Styling */}
            <div className="relative">
              {/* GitHub - Calligraphy Style */}
              <div className="mb-4">
                <h1 className="text-7xl font-bold text-gray-900 relative inline-block">
                  <span className="font-serif italic bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl tracking-wide transform -rotate-1 inline-block calligraphy-text">
                    GitHub
                  </span>
                  {/* Pen stroke underline effect */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-full">
                    <svg
                      viewBox="0 0 200 20"
                      className="w-full h-4 opacity-80"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10,15 Q50,5 100,12 T190,8"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        className="pen-stroke"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="50%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </h1>
              </div>

              {/* Profile README Generator - Italic Serif */}
              <div className="mt-8">
                <h2 className="text-5xl font-serif italic text-gray-800 leading-tight tracking-wide">
                  <span className="inline-block transform hover:scale-105 transition-transform duration-300">
                    Profile README
                  </span>
                  <br />
                  <span className="inline-block transform hover:scale-105 transition-transform duration-300 mt-2">
                    Generator
                  </span>
                </h2>
              </div>

              {/* Subtle glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-purple-500/5 to-pink-500/5 rounded-2xl blur-2xl -z-10"></div>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in mt-8 font-light">
              Create stunning GitHub profiles with our advanced README
              generator. Showcase your skills and projects with beautiful,
              professional designs.
            </p>
          </div>
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
              {Object.entries(filteredSkillCategories).map(
                ([categoryKey, skills]) => {
                  const categoryTitles: Record<string, string> = {
                    programmingLanguages: "Programming Languages",
                    frontendDev: "Frontend Development",
                    backendDev: "Backend Development",
                    mobileAppDev: "Mobile App Development",
                    aiMl: "AI/ML",
                    database: "Database",
                    devops: "DevOps",
                    dataVisualization: "Data Visualization",
                    baas: "Backend as a Service (BaaS)",
                    framework: "Framework",
                    testing: "Testing",
                    software: "Software",
                    staticSiteGenerators: "Static Site Generators",
                    gameEngines: "Game Engines",
                    automation: "Automation",
                    blockchain: "Blockchain",
                    dataAnalysis: "Data Analysis",
                    other: "Other",
                  };

                  return (
                    <SkillSection
                      key={categoryKey}
                      title={categoryTitles[categoryKey] || categoryKey}
                      skills={skills}
                    />
                  );
                }
              )}
            </div>
          </div>

          {/* Social Section */}
          <div className="bg-white border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8">Social</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                {socialPlatforms.slice(0, 12).map((platform) => (
                  <div key={platform.key} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
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
                      className="flex-1 border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                {socialPlatforms.slice(12).map((platform) => (
                  <div key={platform.key} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
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
                      className="flex-1 border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
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

          {/* Show off your skills Section */}
          <div className="bg-white border rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Show off your skills
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  Select from over 60 core languages, frameworks, backend
                  technologies and web
                </p>
                <p className="text-lg text-gray-600">3 tech.</p>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="grid grid-cols-5 gap-4">
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="C Programming"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="HTML5"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="JavaScript"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Tailwind CSS"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="TypeScript"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="PHP"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Vue.js"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="MongoDB"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Figma"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="React"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Angular"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Flutter"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Python"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Babel"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Python"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Kotlin"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Flutter"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Express"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="GitHub"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="GraphQL"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Bootstrap"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Swift"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Kubernetes"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Sass"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Sass"
                    className="w-12 h-12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Share your socials Section */}
          <div className="bg-white border rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-start">
                <div className="grid grid-cols-3 gap-4">
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="GitHub"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Facebook"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Instagram"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Discord"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="YouTube"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Dribbble"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Twitter"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Medium"
                    className="w-12 h-12"
                  />
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="Threads"
                    className="w-12 h-12"
                  />
                </div>
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Share your socials
                </h2>
                <p className="text-lg text-gray-600">
                  Add links to all of your social profiles and blogs in seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Add some stats Section */}
          <div className="bg-white border rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Add some stats
                </h2>
                <p className="text-lg text-gray-600">
                  Show visitors some key facts through charts, graphs and
                  badges.
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-4 bg-blue-500 rounded"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-4 bg-yellow-500 rounded"></div>
                    <div className="w-36 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-4 bg-purple-500 rounded"></div>
                    <div className="w-40 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      230
                      <br />
                      DAYS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Awesome GitHub Profile Readme Generator Section */}
          <div className="bg-white border rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Awesome GitHub Profile Readme Generator
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Fast Profile Generate
                  </h3>
                  <p className="text-gray-600">
                    GitHub Profile Readme Generator is designed to be fast and
                    easy to use. You don't need to have any coding skills or
                    experience to use it.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Showcase Your Projects
                  </h3>
                  <p className="text-gray-600">
                    You can list the names and links of your projects, and
                    provide a brief description of what they are and what they
                    do
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Show Your Tech Stack
                  </h3>
                  <p className="text-gray-600">
                    One of the benefits of using GitHub Profile Readme Generator
                    is that you can show your tech stack to the world.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Customize Your Readme
                  </h3>
                  <p className="text-gray-600">
                    You can change the colors, fonts, sizes, styles, layouts,
                    etc. that reflects your personality and style.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Create Profile Section */}
          <div className="bg-white border rounded-lg p-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  How to Create Profile Readme Generator
                </h2>
                <p className="text-gray-600 mb-4">
                  Creating a GitHub profile readme with GitHub Profile Generator
                  is very simple and straightforward. You just need to follow
                  these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Go to the GitHub Profile Generator website.</li>
                  <li>
                    Fill out the form with your information. You can use the
                    placeholders as examples.
                  </li>
                  <li>Click on the "Generate Readme" button.</li>
                  <li>
                    Preview the generated markdown code and see how it looks
                    like on your GitHub profile.
                  </li>
                  <li>
                    Copy the code and paste it into your GitHub profile
                    repository.
                  </li>
                  <li>Enjoy your new and improved GitHub profile readme.</li>
                </ol>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  A Github profile sample code
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  <p>Hi, I'm Alice 👋</p>
                  <p>
                    I'm a web developer and designer who loves creating
                    beautiful and functional websites. I have a passion for
                    learning new technologies and exploring new ideas.
                  </p>
                  <p>🌍 I'm from Beijing, China</p>
                  <p>📧 You can reach me at alice@example.com</p>
                  <p>🔧 I use these technologies:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>JavaScript</li>
                    <li>React</li>
                    <li>TailwindCSS</li>
                    <li>Node.js</li>
                    <li>MongoDB</li>
                  </ul>
                  <p>💼 I'm working on these projects:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>
                      Portfolio - A personal portfolio website to showcase my
                      skills and projects.
                    </li>
                    <li>
                      Todo App - A simple and elegant todo app with React and
                      TailwindCSS.
                    </li>
                    <li>
                      Blog - A blog where I share my thoughts and experiences on
                      web development and design.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}