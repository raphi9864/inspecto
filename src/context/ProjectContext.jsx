import { createContext, useContext, useState, useCallback } from "react"
import { FAKE_PROJECTS } from "../data/fakeProjects"

const ProjectContext = createContext()

export function ProjectProvider({ children }) {
  const [activeProject, setActiveProject] = useState(null)
  const clearProject = useCallback(() => setActiveProject(null), [])
  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject, clearProject, projects: FAKE_PROJECTS }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)
