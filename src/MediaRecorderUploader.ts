import IRecorderUploader from "./IRecorderUploader";
import { S3 } from 'aws-sdk'
import IMediaRecorder from "./abstract/IMediaRecorder";

export default class MediaRecorderUploader implements IRecorderUploader {
  private _mediaRecorder: IMediaRecorder;

  MediaRecorderUploader() {
    this.handleRecorderStart = this.handleRecorderStart.bind(this)
  }

  upload(recorder: IMediaRecorder): void {
    if (!recorder) {
      throw new Error('Media recorder is required to start uploading')
    }

    this._mediaRecorder = recorder;
    this.registerEventsOnTheRecorder()
  }

  private registerEventsOnTheRecorder() {
    this._mediaRecorder.onPause = this.handleRecorderStart
  }

  //
  // ─── HANDLING RECORDER EVENTS ───────────────────────────────────────────────────
  //
  private handleRecorderStart() {

  }

  test() {
    const s3 = new S3()
    s3.createMultipartUpload(( error, data) => {
      data.
    })
  }
}
