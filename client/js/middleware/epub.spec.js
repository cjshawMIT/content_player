import {
  handleResponse,
  getRelativePath,
  requestContainer,
  requestRootFile,
  requestTableOfContents,
  __RewireAPI__ as EpubRewire } from './epub';

var requestCalled = false;
const mocks = {
  fakeRequest: () => {
    requestCalled = true;
    return new Promise((resolve, reject) => {
      resolve({text:""});
    });
  }
};

fdescribe('epub middleware', () => {
  beforeEach(() => {
    EpubRewire.__Rewire__('request', mocks.fakeRequest);
    requestCalled = false;
  });

  afterEach(() => { EpubRewire.__ResetDependency__('request'); });

  describe('handleResponse', () => {
    const params = {

      handleItem:(item, param1, param2) => {
      },
      response: {
        text: `<?xml version="1.0" encoding="UTF-8"?>
            <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
              <rootfiles>
                  <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
             </rootfiles>
          </container>`
      }
    };

    const parsedItem = {
      "rootfiles": {
        "full-path": "OEBPS/content.opf",
        "media-type": "application/oebps-package+xml"
      },
      "xmlns": "urn:oasis:names:tc:opendocument:xmlns:container",
      "version": "1.0"
    };

    it("calls handleItem", () => {
      spyOn(params, 'handleItem');
      const callbackParams =  [1,2,3];
      handleResponse(params.response, params.handleItem, callbackParams);

      expect(params.handleItem).toHaveBeenCalledWith(parsedItem, ...callbackParams);
    });
  });

  describe('getRelativePath', () => {
    it("removes rootfile", () => {
      var result = getRelativePath({
        rootfiles: {
          ['full-path']: "folder/content.opf"
        }
      });
      expect(result).toEqual('folder');
    });

    it("returns path from epub root to rootfile", () => {
      var result = getRelativePath({
        rootfiles: {
          ['full-path']: "deeply/nested/folder/content.opf"
        }
      });
      expect(result).toEqual('deeply/nested/folder');
    });

    it("returns empty string when rootfile is at epub root", () => {
      var result = getRelativePath({
        rootfiles: {
          ['full-path']: "content.opf"
        }
      });
      expect(result).toEqual('');
    });
  });

  describe('requestContainer', () => {
    it("should make request", (done) => {
      spyOn(mocks, 'fakeRequest');
      requestContainer({settings:{}}, 'fakeUrl', () => {
        done();
      });
      expect(requestCalled).toEqual(true);
    });
  });
  // describe('requestRootFile', () => {});
  // describe('requestTableOfContents', () => {});
});
