/**
 * This function joins a list of paths and removes duplicate slashes
 * 
 * @example joinUrls('http://localhost:3000', '/api', '/users') => 'http://localhost:3000/api/users'
 * @param urls list of paths to join
 * @returns 
 */
export const joinUrls = (...urls: string[]) => {
    const joinedUrl = urls.join('/');
    return joinedUrl.replace(/([^:]\/)\/+/g, '$1');
  }