import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { ChangeEvent, useState } from 'react'
// import { isTypedArray } from 'util/types';
// import { arrayBuffer } from 'stream/consumers';

const CHUNK_SIZE = 5 * 1024 * 1024;

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

export const FileUploadInput = () => {

  const [progress, setProgress] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileInput = (e) => {
  
    if (e.currentTarget.files === null) return
    else
      setSelectedFile(e.currentTarget.files[0]);
    setFileName(e.currentTarget.files[0].name);
      setProgress('');
  }

  const updloadFile = async () => {
    const fileName = selectedFile?.name || '';
    const fileType = selectedFile?.type || '';
    let uploadId = "";
    let parts = [];

    try {
      const startUploadResponse = await axios.post("http:localhost:3001/start-upload", { fileName, fileType });
      console.log('startUpload: ', startUploadResponse);
      uploadId = startUploadResponse.data.uploadId;
      
      const totalParts = Math.ceil(selectedFile?.size || 0 / CHUNK_SIZE);
      console.log("total parts: ", totalParts);

      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, selectedFile?.size || 0);
        const chunk = selectedFile?.slice(start, end);

        const reader = new FileReader();
        reader.readAsArrayBuffer(chunk || new Blob());

        const uploadPart = () => {
          return new Promise((resolve, reject) => {
            reader.onload = async () => {
              const fileChunkBase64 = btoa(
                new Uint8Array(reader.result).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ""
                )
              );

              const uploadPartResponse = await axios.post(
                "http://localhost:3001/upload-part",
                {
                  fileName,
                  partNumber,
                  uploadId,
                  fileChunk: fileChunkBase64,
                }
              );

              parts.push({
                ETag: uploadPartResponse.data.ETag,
                PartNumber: partNumber,
              });
              resolve(1);
            };

            reader.onerror = reject;
          });
        };

        await uploadPart();
      }
      // Complete the multipart upload
      const completeUploadResponse = await axios.post(
        "http://localhost:3001/complete-upload",
        {
          fileName,
          uploadId,
          parts,
        }
      );

      //setFileUrl(completeUploadResponse.data.fileUrl);
      alert("File uploaded successfully");
      
    }
    catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return (
    <>
      <div className='progressContainer'>
        <p>Upload Progress: {progress}</p>
      </div>

      <Button
        color="success"
        component="label"
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload file { fileName }
        <VisuallyHiddenInput type="file" onChange={handleFileInput} />
      </Button>

      <Button variant="contained" disabled={!selectedFile} onClick={updloadFile} endIcon={<SendIcon />}>
        Send
      </Button>
    </>
  )
}