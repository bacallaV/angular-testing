import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

describe('MapsService', () => {
  let service: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getCurrentPosition', () => {
    it('should save the center current position', () => {
      // Arrange
      const mockData: GeolocationPosition = {
        coords:{
          latitude: 123,
          longitude: 321,
          accuracy: 1,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: 1,
      };
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successFn) => {
        successFn(mockData);
      });

      // Act
      service.getCurrentPosition();

      // Assert
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(service.center).toEqual({
        latitude: mockData.coords.latitude,
        longitude: mockData.coords.longitude,
      });
    });
  });
});
