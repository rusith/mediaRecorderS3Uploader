import IRecorderUploader from "./IRecorderUploader";
import { S3 } from "aws-sdk";
import IMediaRecorder from "./abstract/IMediaRecorder";

interface IUploadPart {
  number: number;
  Etag: string;
}

export default class MediaRecorderUploader implements IRecorderUploader {
  private _mediaRecorder: IMediaRecorder;
  private _currentBlobParts: Blob[];
  private readonly _minChunkSize: number = 5242880;
  private _s3: S3;
  private _currentUploadId: string;
  private _currentPartNumber = 1;
  private _parts: IUploadPart[];

  MediaRecorderUploader(recorder: IMediaRecorder) {
    this.handleData = this.handleData.bind(this);
    this._mediaRecorder = recorder;
    this._s3 = new S3();
  }

  startUploading(): void {
    this._mediaRecorder.ondataavailable = this.handleData;
  }

  //
  // ─── HANDLING RECORDER EVENTS ───────────────────────────────────────────────────
  //

  private async handleData(data: { data: Blob }) {
    const blob = data.data;
    this._currentBlobParts.push(blob);

    let currentLength = 0;
    this._currentBlobParts.forEach(p => (currentLength += p.size));

    if (
      currentLength > this._minChunkSize ||
      this._mediaRecorder.state == "inactive"
    ) {
      await this.startUpload();
      const part = await this.uploadCurrent();
      this._parts.push(part);

      if (this._mediaRecorder.state === "inactive") {
      }
    } else {
      this._currentBlobParts;
    }
    // Have the current five mb chunk
    // If more than five mb, push to the server
  }

  private async uploadCurrent(): Promise<IUploadPart> {
    return new Promise((resolve, reject) => {
      const blob = new Blob(this._currentBlobParts, {
        type: this._mediaRecorder.mimeType
      });
      var number = this._currentPartNumber;
      this._currentPartNumber++;
      this._s3.uploadPart(
        {
          Body: blob,
          Bucket: "",
          Key: "",
          PartNumber: this._currentPartNumber,
          UploadId: this._currentUploadId
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve({ number, Etag: data.ETag });
          }
        }
      );
    });
  }

  private startUpload() {
    return new Promise((resolve, reject) => {
      if (this._currentUploadId) return resolve(this._currentUploadId);
      this._s3.createMultipartUpload(
        {
          Bucket: "",
          Key: "",
          ContentType: this._mediaRecorder.mimeType
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            this._currentUploadId = data.UploadId;
            resolve();
          }
        }
      );
    });
  }

  private completeUpload() {
    return new Promise((resolve, reject) => {
      this._s3.completeMultipartUpload(
        {
          MultipartUpload: {
            Parts: this._parts.map(p => ({
              ETag: p.Etag,
              PartNumber: p.number
            }))
          },
          UploadId: this._currentUploadId,
          Bucket: "",
          Key: ""
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    });
  }
}
