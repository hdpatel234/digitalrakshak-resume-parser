import { mockParsedResume } from "@/data/mock-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Briefcase, GraduationCap, Code, FolderGit2, Award, Globe } from "lucide-react";

export function TableView() {
  const data = mockParsedResume;

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <User className="w-5 h-5 text-primary" />
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{data.personal_information.first_name} {data.personal_information.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{data.personal_information.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{data.personal_information.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{data.personal_information.address}</p>
            </div>
            {data.personal_information.linkedin && (
              <div>
                <p className="text-sm text-muted-foreground">LinkedIn</p>
                <a href={`https://${data.personal_information.linkedin}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                  {data.personal_information.linkedin}
                </a>
              </div>
            )}
            {data.personal_information.github && (
              <div>
                <p className="text-sm text-muted-foreground">GitHub</p>
                <a href={`https://${data.personal_information.github}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                  {data.personal_information.github}
                </a>
              </div>
            )}
          </div>
          
          <Separator className="my-6" />
          
          <h4 className="text-sm font-semibold mb-2">Professional Summary</h4>
          <p className="text-sm text-foreground/90 leading-relaxed">{data.professional_summary}</p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Code className="w-5 h-5 text-primary" />
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm text-muted-foreground mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.languages.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm text-muted-foreground mb-2">Frameworks</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.frameworks.map((skill) => (
                <Badge key={skill} variant="outline" className="border-primary/20 text-primary">{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm text-muted-foreground mb-2">Tools</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.tools.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-4 border-l-2 border-border/60 pb-2 last:pb-0 last:border-transparent">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5" />
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                <div>
                  <h4 className="font-semibold text-base">{exp.role}</h4>
                  <p className="text-sm text-primary font-medium">{exp.company} <span className="text-muted-foreground font-normal ml-1">• {exp.location}</span></p>
                </div>
                <Badge variant="outline" className="w-fit text-xs text-muted-foreground">
                  {exp.start_date} - {exp.end_date}
                </Badge>
              </div>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                {exp.description.map((desc, i) => (
                  <li key={i} className="text-sm text-muted-foreground/90">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row justify-between items-start border-b last:border-0 pb-4 last:pb-0 border-border/40">
              <div>
                <h4 className="font-semibold">{edu.degree} in {edu.field_of_study}</h4>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
              </div>
              <div className="text-right mt-1 sm:mt-0">
                <p className="text-sm font-medium">{edu.graduation_date}</p>
                {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <FolderGit2 className="w-5 h-5 text-primary" />
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {data.projects.map((project, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-muted/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{project.name}</h4>
                {project.url && (
                  <a href={`https://${project.url}`} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                    Link
                  </a>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-[10px] h-4 px-1.5">{tech}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Certifications */}
        <Card className="shadow-sm h-fit">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Award className="w-5 h-5 text-primary" />
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.certifications.map((cert, idx) => (
              <div key={idx}>
                <p className="font-medium text-sm">{cert.name}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                  <span>{cert.issuer}</span>
                  <span>{cert.issue_date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="shadow-sm h-fit">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Globe className="w-5 h-5 text-primary" />
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.languages.map((lang, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <p className="font-medium text-sm">{lang.language}</p>
                <Badge variant="outline" className="text-xs font-normal bg-muted/30">{lang.proficiency}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
