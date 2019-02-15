import {
  IMediaRecorderUploader,
  MediaRecorderUploader
} from "./MediaRecorderS3Uploader";

const up = new MediaRecorderUploader(null);
up.startUploading();
