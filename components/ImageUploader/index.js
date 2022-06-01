import { useState } from "react";
import { auth, storage } from "../../lib/firebase";
import Loader from "../Loader";
import s from "./Uploader.module.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Uploads images to Firebase Storage
export default function ImageUploader({ slug }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async e => {
    // Get the file
    const file = Array.from(e.target.files)[0];

    // Makes reference to the storage bucket location
    const imageRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${slug}/${Date.now()}-${file.name}`
    );
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(imageRef, file);

    // Listen to updates to upload task
    task.on(
      "state_changed",
      snapshot => {
        const pct = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        setProgress(pct);
      },
      error => {
        console.log("unable to upload file");
        console.log(error.code);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(task.snapshot.ref).then(downloadURL => {
          setDownloadURL(downloadURL);
          setUploading(false);
        });
      }
    );

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    // task
    //   .then(d => ref.getDownloadURL())
    //   .then(url => {
    // setDownloadURL(url);
    // setUploading(false);
    //   });
  };

  return (
    <div className={s.uploader}>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className={s.snippet}>{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
