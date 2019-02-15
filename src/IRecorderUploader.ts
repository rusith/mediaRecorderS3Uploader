import IMediaRecorder from "./abstract/IMediaRecorder";

export default interface IRecorderUploader {
  /**
   * Starts the upload. Make sure you start recording after calling this
   * @param recorder 
   */
  upload(recorder: IMediaRecorder): void
}