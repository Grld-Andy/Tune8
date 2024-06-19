declare module "music-metadata" {
    export interface IAudioMetadata {
      // Define the structure of IAudioMetadata here based on your needs
      format: {
        duration?: number;
        // Add more properties as needed
      };
      common: {
        title?: string;
        artist?: string;
        album?: string;
        year?: number;
        genre?: string[];
        picture?: IPicture[];
        // Add more properties as needed
      };
      // Add more interfaces as needed
    }
  
    export interface IPicture {
      data: Buffer;
      format: string;
      // Add more properties as needed
    }
  
    // Export functions if necessary
    export function parseFile(filePath: string): Promise<IAudioMetadata>;
  
    // Add more exported functions as needed
  }