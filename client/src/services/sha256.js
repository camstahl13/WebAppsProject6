export default function hash(str) {
    const utf8 = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', utf8).then(hash => {
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    });
}