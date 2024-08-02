export class Tools {
    static massiveRequire(req: { (arg0: any): any; (arg0: any): any; keys: any; }) {
        const files: { key: any; data: any; }[] = [];

        req.keys().forEach((key: any) => {
            files.push({
                key, data: req(key)
            });
        });

        return files;
    }
}
