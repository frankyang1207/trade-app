import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

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
    boarderRadius: '5px',
    boarder: '2px dashed #0086fe',
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

const FileUploader = ({ image, setImage, dirName, imageType }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  // disable the file uploader when it already has an image
  useEffect(() => {
    if (image.preview) {
      setIsDisabled(true);
    }
    else {
      setIsDisabled(false);
    }
    
  }, [image]);

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': []
    },
    disabled: isDisabled,
    maxFiles: 1,
    onDrop: acceptedFiles => {
      handleImage(acceptedFiles[0])
    }
  });

  // upload image file to AWS S3 bucket
  const handleImage = async (file) => {
    let dir_name = dirName;
    let fileParts = file.name.split('.');
    let fileName = `${dir_name}/${uuidv4()}-${fileParts[0]}.${fileParts[1]}`;
    let fileType = fileParts[1];

    try {
      // getting signed URL
      const response = await fetch(process.env.REACT_APP_API + '/s3_signed_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileType }),
      });
      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }
  
      const responseData = await response.json();

      let signedRequest = responseData.signedRequest;
      let url = responseData.url;
  
      try {
        // upload image using signed URL
        const response = await fetch(signedRequest, {
          method: 'PUT',
          headers: {
            'Content-Type': fileType,
          },
          body: file,
        })
        if (response.status === 200) {
          setImage({
            file: file,
            preview: URL.createObjectURL(file),
            url:url
          })
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          error: error.message,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const deleteImage = () => {
    URL.revokeObjectURL(image.preview);
    setImage({ file: undefined, preview: '', url: '' });
  }

  // display preview image
  const thumbs = (
    <div style={thumb} key={image.preview}>
      <div className='thumb-inner' style={thumbInner}>
        <div className='removeIcon' onClick={deleteImage} style={removeIcon}>&times;</div>
        <img
          src={image.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(image.preview) }}
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