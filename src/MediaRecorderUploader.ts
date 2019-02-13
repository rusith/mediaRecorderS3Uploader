import IMediaRecorderUploader, { Prom } from "./IMediaRecorderUploader";

export default class MediaRecorderUploader implements IMediaRecorderUploader {
  public upload(): Prom {
    return new Prom((re, rej) => { re("RES"); });
  }
}
