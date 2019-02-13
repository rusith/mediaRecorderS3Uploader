import { IMediaRecorderUploader, MediaRecorderUploader } from './MediaRecorderS3Uploader';

const up = new MediaRecorderUploader();
up.upload().onFinished((r) => console.log(r))