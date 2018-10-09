import CoreLoader, { LoaderOptions } from "./base/CoreLoader";

declare class DefaultLoader extends CoreLoader {
    constructor(options: LoaderOptions);

    protected init(): void;
    protected loadControllers(): void;
    protected loadServices(): void;
    protected loadRouters(): void;
    protected loadVersionFiles(): void;
    protected useMiddlewares(): void;
    protected wrapMiddleware(): void;
}

export default DefaultLoader;
