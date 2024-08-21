import { DataFile } from '../types';

const JournalFile = ({ file }: { file: DataFile }) => {
  return (
    <div
      style={{

      }}
    >
      <h3
        style={{
          marginBottom: '0.3rem',
        }}
      >{file.name}</h3>
      
      <p>{file.content.slice(0, 100)}...</p>
    </div>
  )
}

export interface JournalFilesProps {
  files: DataFile[];
}

const JournalFiles = ({ files }: JournalFilesProps) => {
  return (
    <div>
      <h2
        style={{
          marginBottom: '1rem',
        }}
      >Journal files</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {files.map(file => (
          <JournalFile key={file.name} file={file} />
        ))}
      </div>
    </div>
  )
}

export default JournalFiles;