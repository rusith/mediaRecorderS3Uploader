export default interface IMediaRecorderUploader {
  upload(): Prom;
}


export class Prom extends Promise<string> {
  public onFinished(func: (a: string) => void) {
    func("ss");
  }
}
