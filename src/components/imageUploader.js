import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabaseClient';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};
  
const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  position: 'relative'
};

const img = {
  display: 'block',
  width: '100px',
  height: '100%'
};

const dropzone = {
  marginTop: '10px',
  width: '100%',
  height: '200px',
  borderRadius: '5px',
  border: '2px dashed #0086fe',
  color: '#0086fe',
  background: '#f4f3f9',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const removeIcon = {
  position: 'absolute',
  top: '-12px',
  right: '3px',
  fontSize: '30px',
  cursor: 'pointer',
};

const revokeIfBlob = (url) => {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
};

const FileUploader = ({ image, setImage, dirName, imageType }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  // Disable the file uploader when it already has an image
  useEffect(() => {
    if (image.preview) {
      setIsDisabled(true);
    }
    else {
      setIsDisabled(false);
    }
    
  }, [image.preview]);

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': []
    },
    disabled: isDisabled,
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles?.[0]) handleImage(acceptedFiles[0]);
    }
  });

 // Upload image file to Supabase Storage
  const handleImage = async (file) => {
    let dir_name = dirName;
    let fileParts = file.name.split('.');
    let fileName = `${dir_name}/${uuidv4()}-${fileParts[0]}.${fileParts[1]}`;

    // Create preview first
    const blobPreview = URL.createObjectURL(file);

    // Revoke old blob preview
    setImage((prev) => {
      revokeIfBlob(prev.preview);
      return {
        file,
        preview: blobPreview,
        url: prev.url || '',  
      };
    });

    // try {
    //   // Upload to Supabase Storage
    //   const { error } = await supabase.storage
    //     .from('trade-app-images') 
    //     .upload(fileName, file, {
    //       contentType: file.type, 
    //       upsert: false,
    //     });

    //   if (error) {
    //     console.log(error);
    //     return { success: false, error: error.message };
    //   }

    //   // Get public URL
    //   const { data } = supabase.storage
    //     .from('trade-app-images')
    //     .getPublicUrl(fileName);
    //   const url = data?.publicUrl || data?.publicURL;

    //   // Update image state
    //   setImage({
    //     file: file,
    //     preview: URL.createObjectURL(file),
    //     url: url,
    //   });
    
    //   return { success: true, url };
    // } catch (error) {
    //   console.log(error);
    //   return { success: false, error: error.message };
    // }
  };

  const deleteImage = () => {
    revokeIfBlob(image.preview);
    setImage({ file: undefined, preview: '', url: '' });
  }

  // Display preview image
  const thumbs = (
    <div style={thumb} key={image.preview}>
      <div className='thumb-inner' style={thumbInner}>
        <div className='removeIcon' onClick={deleteImage} style={removeIcon}>&times;</div>
        <img
          src={image.preview}
          style={img}
          // Revoke data uri after image is loaded
          // onLoad={() => { URL.revokeObjectURL(image.preview) }}
          alt="preview"
        />
        
      </div>
      
    </div>
  );

  return (
    <section className="dropzone-container" >
        <div {...getRootProps({className: 'dropzone'})} style={dropzone}>
        { !image.preview ?
            <>
            <input {...getInputProps()} />
            <p>Upload {imageType} image here</p> 
            </>:
            <div style={thumbsContainer}>
            {thumbs}
            </div>}
        </div>
    </section>
  );
};

export default FileUploader;