import { S3 } from "aws-sdk";
import IMediaRecorder from "./abstract/IMediaRecorder";
import IRecorderUploader from "./IRecorderUploader";

interface IUploadPart {
  number: number;
  Etag: string;
}

export default class MediaRecorderUploader implements IRecorderUploader {
  private readonly minChunkSize: number = 5242880;
  private mediaRecorder: IMediaRecorder;
  private currentBlobParts: Blob[];
  private s3: S3;
  private currentUploadId: string;
  private currentPartNumber = 1;
  private parts: IUploadPart[];

  constructor(recorder: IMediaRecorder) {
    this.handleData = this.handleData.bind(this);
    this.mediaRecorder = recorder;
    this.s3 = new S3();
  }

  public startUploading(): void {
    this.mediaRecorder.ondataavailable = this.handleData;
  }

  //
  // ─── HANDLING RECORDER EVENTS ───────────────────────────────────────────────────
  //

  private async handleData(data: { data: Blob }) {
    const blob = data.data;
    this.currentBlobParts.push(blob);

    let currentLength = 0;
    this.currentBlobParts.forEach((p) => (currentLength += p.size));

    if (
      currentLength > this.minChunkSize ||
      this.mediaRecorder.state === "inactive"
    ) {
      await this.startUpload();
      const part = await this.uploadCurrent();
      this.parts.push(part);

      if (this.mediaRecorder.state === "inactive") {
        await this.completeUpload();
      }
    }
    // Have the current five mb chunk
    // If more than five mb, push to the server
  }

  private async uploadCurrent(): Promise<IUploadPart> {
    return new Promise((resolve, reject) => {
      const blob = new Blob(this.currentBlobParts, {
        type: this.mediaRecorder.mimeType,
      });
      const num = this.currentPartNumber;
      this.currentPartNumber++;
      this.s3.uploadPart(
        {
          Body: blob,
          Bucket: "",
          Key: "",
          PartNumber: this.currentPartNumber,
          UploadId: this.currentUploadId,
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve({ number: num, Etag: data.ETag });
          }
        },
      );
    });
  }

  private startUpload() {
    return new Promise((resolve, reject) => {
      if (this.currentUploadId) {
        return resolve(this.currentUploadId);
      }
      this.s3.createMultipartUpload(
        {
          Bucket: "",
          ContentType: this.mediaRecorder.mimeType,
          Key: "",
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            this.currentUploadId = data.UploadId;
            resolve();
          }
        },
      );
    });
  }

  private completeUpload() {
    return new Promise((resolve, reject) => {
      this.s3.completeMultipartUpload(
        {
          Bucket: "",
          Key: "",
          MultipartUpload: {
            Parts: this.parts.map((p) => ({
              ETag: p.Etag,
              PartNumber: p.number,
            })),
          },
          UploadId: this.currentUploadId,
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        },
      );
    });
  }
}
