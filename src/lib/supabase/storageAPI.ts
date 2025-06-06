
import { supabase } from '../../integrations/supabase/client';

// Storage operations for company logos
export const storageAPI = {
  async uploadLogo(id: string, file: File, altText: string): Promise<string> {
    console.log(`Uploading logo file for company ${id}: ${file.name}`);
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}.${fileExt}`;
    const filePath = `logos/${fileName}`;
    
    try {
      console.log(`Attempting to upload to path: ${filePath}`);
      const { data, error } = await supabase
        .storage
        .from('company-logos')
        .upload(filePath, file, {
          upsert: true
        });
      
      if (error) {
        console.error(`Error uploading logo for company ${id}:`, error);
        throw error;
      }
      
      console.log('Upload successful, data:', data);
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(filePath);
        
      console.log(`Generated public URL: ${urlData.publicUrl}`);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  },
  
  async uploadLogoToStorage(id: string, file: File, fileName: string): Promise<string> {
    console.log(`Uploading logo file to storage for company ${id}: ${fileName}`);
    const fileExt = fileName.split('.').pop();
    const fileBaseName = `${id}.${fileExt}`;
    const filePath = `logos/${fileBaseName}`;
    
    try {
      console.log(`Attempting to upload to path: ${filePath}`);
      const { data, error } = await supabase
        .storage
        .from('company-logos')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '0' // Prevent caching
        });
      
      if (error) {
        console.error(`Error uploading logo for company ${id}:`, error);
        throw error;
      }
      
      console.log('Upload successful, data:', data);
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('company-logos')
        .getPublicUrl(filePath);
        
      console.log(`Generated public URL: ${urlData.publicUrl}`);
      
      // Return with explicit cache busting parameter
      const urlWithCacheBusting = `${urlData.publicUrl}?t=${Date.now()}`;
      console.log(`URL with cache busting: ${urlWithCacheBusting}`);
      return urlWithCacheBusting;
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  },
  
  getPublicUrl(path: string): string {
    const { data } = supabase
      .storage
      .from('company-logos')
      .getPublicUrl(path);
      
    // Always add cache busting to prevent stale images
    return `${data.publicUrl}?t=${Date.now()}`;
  }
};
