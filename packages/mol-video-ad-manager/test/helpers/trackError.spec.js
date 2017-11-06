import {
  noAdParsedXML,
  vastNoAdXML,
  vastWrapperXML,
  wrapperParsedXML,
  wrapperAd
} from 'mol-vast-fixtures';
import {
  getAdErrorURI,
  getVastErrorURI
} from 'mol-vast-selectors';
import {track} from 'mol-video-ad-tracker';
import trackError from '../../src/helpers/trackError';

jest.mock('mol-video-ad-tracker', () => ({track: jest.fn()}));

afterEach(() => {
  track.mockClear();
});

const vastChain = [
  {
    ad: null,
    error: expect.any(Error),
    errorCode: 203,
    parsedXML: noAdParsedXML,
    requestTag: 'https://test.example.com/vastadtaguri',
    XML: vastNoAdXML
  },
  {
    ad: wrapperAd,
    errorCode: null,
    parsedXML: wrapperParsedXML,
    requestTag: 'http://adtag.test.example.com',
    XML: vastWrapperXML
  }
];

test('trackError must track the errors using `mol-video-ad-tracker` track fn', () => {
  trackError(vastChain);

  expect(track).toHaveBeenCalledTimes(2);
  expect(track).toHaveBeenCalledWith(getVastErrorURI(noAdParsedXML), {ERRORCODE: 203});
  expect(track).toHaveBeenCalledWith(getAdErrorURI(wrapperAd), {ERRORCODE: 203});
});

test('trackError must accept an optional track funnction', () => {
  const mockTrack = jest.fn();

  trackError(vastChain, mockTrack);

  expect(track).not.toHaveBeenCalled();
  expect(mockTrack).toHaveBeenCalledTimes(2);
  expect(mockTrack).toHaveBeenCalledWith(getVastErrorURI(noAdParsedXML), {ERRORCODE: 203});
  expect(mockTrack).toHaveBeenCalledWith(getAdErrorURI(wrapperAd), {ERRORCODE: 203});
});
