export default interface IMediaRecorder {
  ondataavailable: (data: { data: Blob }) => void;
  mimeType: string;
  state: string;
}
