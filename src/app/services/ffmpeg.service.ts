import { Injectable } from '@angular/core';
import { createFFmpeg } from "@ffmpeg/ffmpeg";

//service where we outsource the logic and initialize the FFmpeg package

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  
  //this property will be accessible to those components (via a getter function) who use the service to let them know
  //when the package is loaded to be able to take the screenshots
  private isReady: boolean = false;
  //this will be the ffmpeg object, with all its methods
  private ffmpeg;

  constructor() {
    //this function returns an instance of the FFmpeg class
    this.ffmpeg = createFFmpeg({ log: true });
  }

  //getter function for the isReady property, that signals when the package is loaded
  get gIsReady() {
    return this.isReady;
  }

  //we'll load the WASM file with this function. It's a big one (25mb), so we're doing it asynchronously.
  async init() {
    //we'll first check if the WASM file wasn't loaded previously, by checking the public property isReady
    if(this.isReady) {
      return
    }

    await this.ffmpeg.load();
    this.isReady = true;
  }
}
