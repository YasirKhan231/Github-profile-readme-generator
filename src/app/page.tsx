"use client";

import type React from "react";
import {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowLeft, Copy, Download, Eye } from "lucide-react";
import { skillCategories, skillIcons, type Skill } from "@/data/skills";
import { socialPlatforms } from "@/data/socialplateform";

// Lazy load heavy components
const Navbar = lazy(() => import("@/components/navbar"));

// Constants
const STORAGE_KEYS = {
  FORM_DATA: "github-readme-form-data",
  SOCIAL_LINKS: "github-readme-social-links",
  SELECTED_SKILLS: "github-readme-selected-skills",
  SELECTED_ADDONS: "github-readme-selected-addons",
  STATS_THEME: "github-readme-stats-theme",
  WORK_LABELS: "github-readme-work-labels",
};

const DEBOUNCE_DELAY = 500;

// Custom hooks
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

// Optimized Input Component
const OptimizedInput = memo(
  ({
    placeholder,
    value,
    onChange,
    className,
  }: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const debouncedValue = useDebounce(localValue, DEBOUNCE_DELAY);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    useEffect(() => {
      if (debouncedValue !== value) {
        onChange(debouncedValue);
      }
    }, [debouncedValue, onChange, value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
      },
      []
    );

    return (
      <Input
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className={className}
      />
    );
  }
);

OptimizedInput.displayName = "OptimizedInput";

// Memoized Skill Item Component
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

    const handleClick = useCallback(() => {
      onToggle(skill.key);
    }, [onToggle, skill.key]);

    return (
      <div className="flex items-center gap-3">
        <Checkbox
          id={skill.key}
          checked={isSelected}
          onCheckedChange={handleClick}
          className="w-4 h-4"
        />
        <div className="relative group cursor-pointer" onClick={handleClick}>
          <img
            src={iconUrl || "/placeholder.svg"}
            alt={skill.name}
            className="w-12 h-12 object-contain hover:scale-110 transition-transform duration-200"
            loading="lazy"
          />
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
            {skill.name}
          </div>
        </div>
      </div>
    );
  }
);

SkillItem.displayName = "SkillItem";

// Memoized Skill Section Component
const SkillSection = memo(
  ({
    title,
    skills,
    selectedSkills,
    onSkillToggle,
  }: {
    title: string;
    skills: Skill[];
    selectedSkills: string[];
    onSkillToggle: (skillKey: string) => void;
  }) => (
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
            onToggle={onSkillToggle}
          />
        ))}
      </div>
    </div>
  )
);

SkillSection.displayName = "SkillSection";

// Memoized Social Input Component
const SocialInput = memo(
  ({
    platform,
    value,
    onChange,
  }: {
    platform: { key: string; name: string; icon?: string; placeholder: string };
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
        <img
          src={platform.icon || "/placeholder.svg"}
          alt={platform.name}
          className="w-6 h-6 object-contain"
          loading="lazy"
        />
      </div>
      <OptimizedInput
        placeholder={platform.placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
      />
    </div>
  )
);

SocialInput.displayName = "SocialInput";

// Optimized Background Animation Component
const BackgroundAnimation = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Reduced number of animated elements for better performance */}
    <div className="absolute top-20 left-10 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
    <div className="absolute top-32 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
    <div className="absolute top-48 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
    <div className="absolute top-64 right-1/3 w-5 h-5 bg-blue-400 rounded-full animate-pulse"></div>

    <div className="absolute top-56 right-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[17px] border-l-transparent border-r-transparent border-b-yellow-400 opacity-70 animate-float-fast"></div>
    <div className="absolute top-72 left-20 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[12px] border-l-transparent border-r-transparent border-b-blue-400 opacity-40 animate-float-medium"></div>
    <div className="absolute top-88 right-1/5 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-green-400 opacity-60 animate-float-slow"></div>
  </div>
));

BackgroundAnimation.displayName = "BackgroundAnimation";

export default function GitHubReadmeGenerator() {
  const [currentStep, setCurrentStep] = useState("form");

  // Split state into smaller pieces for better performance
  const [formData, setFormData] = useLocalStorage(STORAGE_KEYS.FORM_DATA, {
    name: "",
    subtitle: "",
    currentProject: "",
    currentProjectLink: "",
    collaborationProject: "",
    collaborationLink: "",
    helpProject: "",
    helpLink: "",
    learningDetails: "",
    askDetails: "",
    reachDetails: "",
    portfolioLink: "",
    blogLink: "",
    resumeLink: "",
    funFact: "",
  });

  const [workLabels, setWorkLabels] = useLocalStorage(
    STORAGE_KEYS.WORK_LABELS,
    {
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
    }
  );

  const [selectedSkills, setSelectedSkills] = useLocalStorage<string[]>(
    STORAGE_KEYS.SELECTED_SKILLS,
    []
  );
  const [selectedAddons, setSelectedAddons] = useLocalStorage<string[]>(
    STORAGE_KEYS.SELECTED_ADDONS,
    []
  );
  const [statsTheme, setStatsTheme] = useLocalStorage(
    STORAGE_KEYS.STATS_THEME,
    "default"
  );

  const [socialLinks, setSocialLinks] = useLocalStorage(
    STORAGE_KEYS.SOCIAL_LINKS,
    {
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
    }
  );

  const [addonErrors, setAddonErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized handlers
  const handleInputChange = useCallback(
    (field: string) => {
      return (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      };
    },
    [setFormData]
  );

  const handleWorkLabelChange = useCallback(
    (field: string) => {
      return (value: string) => {
        setWorkLabels((prev) => ({ ...prev, [field]: value }));
      };
    },
    [setWorkLabels]
  );

  const handleSkillToggle = useCallback(
    (skillKey: string) => {
      setSelectedSkills((prev) =>
        prev.includes(skillKey)
          ? prev.filter((s) => s !== skillKey)
          : [...prev, skillKey]
      );
    },
    [setSelectedSkills]
  );

  const handleSocialChange = useCallback(
    (platform: string) => {
      return (value: string) => {
        setSocialLinks((prev) => ({ ...prev, [platform]: value }));
        setAddonErrors((prev) =>
          prev.filter((error) => !error.includes(platform))
        );
      };
    },
    [setSocialLinks]
  );

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
    [
      socialLinks.twitter,
      socialLinks.devto,
      socialLinks.medium,
      setSelectedAddons,
    ]
  );

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

    // Add work sections
    if (formData.currentProject) {
      markdown += `${workLabels.currentWork} [${formData.currentProject}](${
        formData.currentProjectLink || "#"
      })\n\n`;
    }
    if (formData.collaborationProject) {
      markdown += `${workLabels.collaboration} [${
        formData.collaborationProject
      }](${formData.collaborationLink || "#"})\n\n`;
    }
    if (formData.helpProject) {
      markdown += `${workLabels.helpWith} [${formData.helpProject}](${
        formData.helpLink || "#"
      })\n\n`;
    }
    if (formData.learningDetails) {
      markdown += `${workLabels.learning} ${formData.learningDetails}\n\n`;
    }
    if (formData.askDetails) {
      markdown += `${workLabels.askAbout} ${formData.askDetails}\n\n`;
    }
    if (formData.reachDetails) {
      markdown += `${workLabels.reachMe} ${formData.reachDetails}\n\n`;
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
      markdown += `${workLabels.funFact} ${formData.funFact}\n\n`;
    }

    // Add social links
    if (Object.values(socialLinks).some((link) => link)) {
      markdown += `<h3 align="left">Connect with me:</h3>\n<p align="left">\n`;

      const socialIcons = {
        github:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/github.svg",
        twitter:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg",
        linkedin:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg",
        facebook:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/facebook.svg",
        instagram:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg",
        youtube:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/youtube.svg",
        leetcode:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/leet-code.svg",
        codechef:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/codechef.svg",
        codeforces:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/codeforces.svg",
        gfg: "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/geeks-for-geeks.svg",
        hackerrank:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/hackerrank.svg",
        hackerearth:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/hackerearth.svg",
        devto:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/devto.svg",
        medium:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/medium.svg",
        stackoverflow:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/stack-overflow.svg",
        kaggle:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/kaggle.svg",
        dribbble:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/dribbble.svg",
        behance:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/behance.svg",
        hashnode:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/hashnode.svg",
        discord:
          "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/discord.svg",
        rss: "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/rss.svg",
      };

      Object.entries(socialLinks).forEach(([platform, username]) => {
        if (username) {
          let url = "";
          switch (platform) {
            case "github":
              url = `https://github.com/${username}`;
              break;
            case "twitter":
              url = `https://twitter.com/${username}`;
              break;
            case "linkedin":
              url = `https://linkedin.com/in/${username}`;
              break;
            case "stackoverflow":
              url = `https://stackoverflow.com/users/${username}`;
              break;
            case "medium":
              url = `https://medium.com/${username}`;
              break;
            case "devto":
              url = `https://dev.to/${username}`;
              break;
            case "hashnode":
              url = `https://hashnode.com/${username}`;
              break;
            case "youtube":
              url = `https://youtube.com/c/${username}`;
              break;
            case "discord":
              url = `https://discord.gg/${username}`;
              break;
            case "rss":
              url = username;
              break;
            case "leetcode":
              url = `https://leetcode.com/${username}`;
              break;
            case "codechef":
              url = `https://www.codechef.com/users/${username}`;
              break;
            case "codeforces":
              url = `https://codeforces.com/profile/${username}`;
              break;
            case "gfg":
              url = `https://auth.geeksforgeeks.org/user/${username}`;
              break;
            case "hackerrank":
              url = `https://www.hackerrank.com/${username}`;
              break;
            case "hackerearth":
              url = `https://www.hackerearth.com/${username}`;
              break;
            default:
              url = `https://${platform}.com/${username}`;
          }

          const iconUrl = socialIcons[platform as keyof typeof socialIcons];
          if (iconUrl) {
            markdown += `<a href="${url}" target="_blank"><img src="${iconUrl}" alt="${username}" height="30" width="40" /></a>\n`;
          }
        }
      });
      markdown += `</p>\n\n`;
    }

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

    // Add GitHub stats and addons
    if (selectedAddons.length > 0 && socialLinks.github) {
      const username = socialLinks.github;

      if (selectedAddons.includes("display github trophy")) {
        markdown += `<p align="left"> <a href="https://github.com/ryo-ma/github-profile-trophy"><img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=${statsTheme}" alt="${username}" /></a> </p>\n\n`;
      }

      if (selectedAddons.includes("display visitors count badge 👁️")) {
        markdown += `<p align="left"> <img src="https://komarev.com/ghpvc/?username=${username}&label=Profile%20views&color=0e75b6&style=flat" alt="${username}" /> </p>\n\n`;
      }

      if (selectedAddons.includes("display github profile stats card 📊")) {
        markdown += `<p>&nbsp;<img align="center" src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&locale=en&theme=${statsTheme}" alt="${username}" /></p>\n\n`;
      }

      if (
        selectedAddons.includes("display top skills 📊") ||
        selectedAddons.includes("display most used languages")
      ) {
        markdown += `<p><img align="left" src="https://github-readme-stats.vercel.app/api/top-langs?username=${username}&show_icons=true&locale=en&layout=compact&theme=${statsTheme}" alt="${username}" /></p>\n\n`;
      }

      if (selectedAddons.includes("display github streak stats 🔥")) {
        markdown += `<p><img align="center" src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${statsTheme}" alt="${username}" /></p>\n\n`;
      }

      if (selectedAddons.includes("display contribution stats")) {
        markdown += `<p><img align="center" src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&count_private=true&theme=${statsTheme}" alt="${username}" /></p>\n\n`;
      }

      if (
        selectedAddons.includes("display twitter badge") &&
        socialLinks.twitter
      ) {
        markdown += `<p align="left"> <a href="https://twitter.com/${socialLinks.twitter}" target="blank"><img src="https://img.shields.io/twitter/follow/${socialLinks.twitter}?logo=twitter&style=for-the-badge" alt="${socialLinks.twitter}" /></a> </p>\n\n`;
      }

      if (
        selectedAddons.includes(
          "display latest dev.to blogs dynamically (GitHub Action)"
        ) &&
        socialLinks.devto
      ) {
        markdown += `### Blogs posts\n<!-- BLOG-POST-LIST:START -->\n<!-- BLOG-POST-LIST:END -->\n\n`;
      }

      if (
        selectedAddons.includes(
          "display latest medium blogs dynamically (GitHub Action)"
        ) &&
        socialLinks.medium
      ) {
        markdown += `### Medium posts\n<!-- MEDIUM-POST-LIST:START -->\n<!-- MEDIUM-POST-LIST:END -->\n\n`;
      }
    }

    setGeneratedMarkdown(markdown);
    setCurrentStep("output");
  }, [
    formData,
    workLabels,
    socialLinks,
    selectedSkills,
    selectedAddons,
    statsTheme,
  ]);

  // Memoized filtered skills for search performance
  const filteredSkillCategories = useMemo(() => {
    if (!debouncedSearchTerm) return skillCategories;

    const filtered: typeof skillCategories = {} as typeof skillCategories;
    Object.entries(skillCategories).forEach(([categoryKey, skills]) => {
      const filteredSkills = skills.filter((skill) =>
        skill.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      if (filteredSkills.length > 0) {
        filtered[categoryKey as keyof typeof skillCategories] = filteredSkills;
      }
    });
    return filtered;
  }, [debouncedSearchTerm]);

  const addons = useMemo(
    () => [
      "display visitors count badge 👁️",
      "display github trophy",
      "display github profile stats card 📊",
      "display top skills 📊",
      "display most used languages",
      "display github streak stats 🔥",
      "display contribution stats",
      "display twitter badge",
      "display latest dev.to blogs dynamically (GitHub Action)",
      "display latest medium blogs dynamically (GitHub Action)",
      "display latest blogs from your personal blog dynamically (GitHub Action)",
    ],
    []
  );
  const themes = useMemo(
    () => [
      { value: "default", label: "Default" },
      { value: "dark", label: "Dark" },
      { value: "radical", label: "Radical" },
      { value: "merko", label: "Merko" },
      { value: "gruvbox", label: "Gruvbox" },
      { value: "tokyonight", label: "Tokyo Night" },
      { value: "onedark", label: "One Dark" },
      { value: "cobalt", label: "Cobalt" },
      { value: "synthwave", label: "Synthwave" },
      { value: "highcontrast", label: "High Contrast" },
      { value: "dracula", label: "Dracula" },
      { value: "prussian", label: "Prussian" },
      { value: "monokai", label: "Monokai" },
      { value: "vue", label: "Vue" },
      { value: "vue-dark", label: "Vue Dark" },
      { value: "shades-of-purple", label: "Shades of Purple" },
      { value: "nightowl", label: "Night Owl" },
      { value: "buefy", label: "Buefy" },
      { value: "blue-green", label: "Blue Green" },
      { value: "algolia", label: "Algolia" },
      { value: "great-gatsby", label: "Great Gatsby" },
      { value: "darcula", label: "Darcula" },
      { value: "bear", label: "Bear" },
      { value: "solarized-dark", label: "Solarized Dark" },
      { value: "solarized-light", label: "Solarized Light" },
      { value: "chartreuse-dark", label: "Chartreuse Dark" },
      { value: "nord", label: "Nord" },
      { value: "gotham", label: "Gotham" },
      { value: "material-palenight", label: "Material Palenight" },
      { value: "graywhite", label: "Gray White" },
      { value: "vision-friendly-dark", label: "Vision Friendly Dark" },
      { value: "ayu-mirage", label: "Ayu Mirage" },
      { value: "midnight-purple", label: "Midnight Purple" },
      { value: "calm", label: "Calm" },
      { value: "flag-india", label: "Flag India" },
      { value: "omni", label: "Omni" },
      { value: "react", label: "React" },
      { value: "jolly", label: "Jolly" },
      { value: "maroongold", label: "Maroon Gold" },
      { value: "yeblu", label: "Yeblu" },
      { value: "blueberry", label: "Blueberry" },
      { value: "slateorange", label: "Slate Orange" },
      { value: "kacho_ga", label: "Kacho Ga" },
      { value: "outrun", label: "Outrun" },
      { value: "ocean_dark", label: "Ocean Dark" },
      { value: "city_lights", label: "City Lights" },
      { value: "github_dark", label: "GitHub Dark" },
      { value: "discord_old_blurple", label: "Discord Old Blurple" },
      { value: "aura_dark", label: "Aura Dark" },
      { value: "panda", label: "Panda" },
      { value: "noctis_minimus", label: "Noctis Minimus" },
      { value: "cobalt2", label: "Cobalt2" },
      { value: "swift", label: "Swift" },
      { value: "aura", label: "Aura" },
      { value: "apprentice", label: "Apprentice" },
      { value: "moltack", label: "Moltack" },
      { value: "codeSTACKr", label: "CodeSTACKr" },
      { value: "rose_pine", label: "Rose Pine" },
    ],
    []
  );
  // Rest of the component code remains the same...
  // [Previous code continues...]

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
      <BackgroundAnimation />

      <div className="container mx-auto px-8 py-10 max-w-7xl relative z-10">
        {/* Header */}
        <Suspense
          fallback={
            <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
          }
        >
          <Navbar />
        </Suspense>

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
                <OptimizedInput
                  placeholder="name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="flex-1 border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-lg py-3 px-0"
                />
              </div>
              <h3 className="text-xl font-semibold mt-12">Subtitle</h3>
              <OptimizedInput
                placeholder="A passionate frontend developer from India"
                value={formData.subtitle}
                onChange={handleInputChange("subtitle")}
                className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-lg py-3 px-0"
              />

              <h3 className="text-xl font-semibold mt-12">Work</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-8 items-center">
                  <OptimizedInput
                    placeholder="🔭 I'm currently working on"
                    value={workLabels.currentWork}
                    onChange={handleWorkLabelChange("currentWork")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="project name"
                    value={formData.currentProject}
                    onChange={handleInputChange("currentProject")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                  <OptimizedInput
                    placeholder="project link"
                    value={formData.currentProjectLink}
                    onChange={handleInputChange("currentProjectLink")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-8 items-center">
                  <OptimizedInput
                    placeholder="👯 I'm looking to collaborate on"
                    value={workLabels.collaboration}
                    onChange={handleWorkLabelChange("collaboration")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="project name"
                    value={formData.collaborationProject}
                    onChange={handleInputChange("collaborationProject")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                  <OptimizedInput
                    placeholder="project link"
                    value={formData.collaborationLink}
                    onChange={handleInputChange("collaborationLink")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-8 items-center">
                  <OptimizedInput
                    placeholder="🤝 I'm looking for help with"
                    value={workLabels.helpWith}
                    onChange={handleWorkLabelChange("helpWith")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="project name"
                    value={formData.helpProject}
                    onChange={handleInputChange("helpProject")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                  <OptimizedInput
                    placeholder="project link"
                    value={formData.helpLink}
                    onChange={handleInputChange("helpLink")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <OptimizedInput
                    placeholder="🌱 I'm currently learning"
                    value={workLabels.learning}
                    onChange={handleWorkLabelChange("learning")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="Frameworks, courses etc."
                    value={formData.learningDetails}
                    onChange={handleInputChange("learningDetails")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <OptimizedInput
                    placeholder="💬 Ask me about"
                    value={workLabels.askAbout}
                    onChange={handleWorkLabelChange("askAbout")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="react, vue and gsap"
                    value={formData.askDetails}
                    onChange={handleInputChange("askDetails")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <OptimizedInput
                    placeholder="📫 How to reach me"
                    value={workLabels.reachMe}
                    onChange={handleWorkLabelChange("reachMe")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="example@gmail.com"
                    value={formData.reachDetails}
                    onChange={handleInputChange("reachDetails")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <OptimizedInput
                    placeholder="👨‍💻 All of my projects are available at"
                    value={workLabels.portfolio}
                    onChange={handleWorkLabelChange("portfolio")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="portfolio link"
                    value={formData.portfolioLink}
                    onChange={handleInputChange("portfolioLink")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <OptimizedInput
                    placeholder="📝 I regularly write articles on"
                    value={workLabels.blog}
                    onChange={handleWorkLabelChange("blog")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="blog link"
                    value={formData.blogLink}
                    onChange={handleInputChange("blogLink")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <OptimizedInput
                    placeholder="📄 Know about my experiences"
                    value={workLabels.resume}
                    onChange={handleWorkLabelChange("resume")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="resume link"
                    value={formData.resumeLink}
                    onChange={handleInputChange("resumeLink")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  <OptimizedInput
                    placeholder="⚡ Fun fact"
                    value={workLabels.funFact}
                    onChange={handleWorkLabelChange("funFact")}
                    className="border-b-2 border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none text-base py-3 px-0 w-full font-medium"
                  />
                  <OptimizedInput
                    placeholder="I think I am funny"
                    value={formData.funFact}
                    onChange={handleInputChange("funFact")}
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
                      skills={skills as Skill[]}
                      selectedSkills={selectedSkills}
                      onSkillToggle={handleSkillToggle}
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
                  <SocialInput
                    key={platform.key}
                    platform={platform}
                    value={
                      socialLinks[platform.key as keyof typeof socialLinks]
                    }
                    onChange={handleSocialChange(platform.key)}
                  />
                ))}
              </div>
              <div className="space-y-6">
                {socialPlatforms.slice(12).map((platform) => (
                  <SocialInput
                    key={platform.key}
                    platform={platform}
                    value={
                      socialLinks[platform.key as keyof typeof socialLinks]
                    }
                    onChange={handleSocialChange(platform.key)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="bg-white border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8">Add-ons</h2>

            <div className="mb-8">
              <Label className="text-base font-medium mb-4 block">
                Choose Theme for Stats (GitHub Trophy, Stats Cards, etc.)
              </Label>
              <Select value={statsTheme} onValueChange={setStatsTheme}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-white">
                  {themes.map((theme) => (
                    <SelectItem
                      key={theme.value}
                      value={theme.value}
                      className=" bg-white hover:bg-gray-100"
                    >
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

          {/* Feature Sections */}
          <div className="bg-white border rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Show off your skills
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  Select from over 60 core languages, frameworks, backend
                  technologies and web3 technologies to showcase your expertise.
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="grid grid-cols-5 gap-4">
                  {[
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/c-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/php-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vuejs-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/figma-colored.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg",
                  ].map((src, index) => (
                    <div
                      key={index}
                      className="transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg rounded-full p-1"
                    >
                      <img
                        src={src || "/placeholder.svg"}
                        alt="Skill"
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-start">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/facebook.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/instagram.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/discord.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/youtube.svg",
                    "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/dribbble.svg",
                  ].map((src, index) => (
                    <div
                      key={index}
                      className="transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg rounded-full p-1"
                    >
                      <img
                        src={src || "/placeholder.svg"}
                        alt="Social"
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
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

          <div className="bg-white border rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                GitHub Profile Readme Generator
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Fast Profile Generate in Under 5 minute
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
        </div>
      </div>
    </div>
  );
}
