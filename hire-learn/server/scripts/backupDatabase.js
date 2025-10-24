import { exec } from 'child_process'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const backupDatabase = () => {
  const date = new Date().toISOString().split('T')[0]
  const backupPath = path.join(__dirname, '..', 'backups', `backup-${date}`)
  
  const command = `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}"`
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Backup failed:', error)
      return
    }
    console.log('Backup completed successfully:', stdout)
  })
}

backupDatabase()