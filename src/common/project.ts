import { Project } from '@alephium/web3'
import path from 'path'

export async function loadProject(projectRootDir: string) {
  const originalStdoutWrite = process.stdout.write.bind(process.stdout)
  const contractsRootDir = path.resolve(projectRootDir, 'contracts')
  const artifactsRootDir = path.resolve(projectRootDir, 'artifacts')
  process.stdout.write = () => { return true }
  try {
    await Project.build(undefined, projectRootDir, contractsRootDir, artifactsRootDir)
  } finally {
    // Restore the original process.stdout.write method
    process.stdout.write = originalStdoutWrite;
  }
}
