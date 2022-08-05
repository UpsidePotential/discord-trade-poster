import 'jasmine';
import {getNewPositions, Positions} from './ibkr-api';
import {TestData, testdata2} from './testdata/testdata';

describe('ibrk', () => {
  
    it('should not get any new positions for equal lists', () => {
      const a : Positions[] = [
        {
          fullName: "UVXY Aug19'22 15 Call",
          acctId: "123",
          avgPrice: 123,
          baseRealizedPnl: 0,
          contractDesc: "",
          position: 5,
          putOrCall: "call",
          strike: "asdf",
          unrealizedPnl: 0,
          conid: 1,
          ticker: 'UVXY',
        }
      ];

      const b : Positions[] = [
        {
          fullName: "UVXY Aug19'22 15 Call",
          acctId: "123",
          avgPrice: 123,
          baseRealizedPnl: 0,
          contractDesc: "",
          position: 5,
          putOrCall: "call",
          strike: "asdf",
          unrealizedPnl: 0,
          conid: 1,
          ticker: 'UVXY',
        }
      ];

      const newPositions = getNewPositions(a, b);

      expect(newPositions.length).toBe(0);
    });

    it('should get new positions for a having new positions', () => {
      const a : Positions[] = [
        {
          fullName: "UVXY Aug19'22 15 Call",
          acctId: "123",
          avgPrice: 123,
          baseRealizedPnl: 0,
          contractDesc: "",
          position: 5,
          putOrCall: "call",
          strike: "asdf",
          unrealizedPnl: 0,
          conid: 2,
          ticker: 'UVXY',
        }
      ];

      const b : Positions[] = [ 
      ];

     let newPositions = getNewPositions(a, b);
     expect(newPositions.length).toBe(1);

     // got deleted
      newPositions = getNewPositions(b, a);
      expect(newPositions.length).toBe(0);
    });

    it('should update on a position size change', () => {
      const a : Positions[] = [
        {
          fullName: "UVXY Aug19'22 15 Call",
          acctId: "123",
          avgPrice: 123,
          baseRealizedPnl: 0,
          contractDesc: "",
          position: 2,
          putOrCall: "call",
          strike: "asdf",
          unrealizedPnl: 0,
          conid: 1,
          ticker: 'UVXY',
        }
      ];

      const b : Positions[] = [ 
        {
          fullName: "UVXY Aug19'22 15 Call",
          acctId: "123",
          avgPrice: 123,
          baseRealizedPnl: 0,
          contractDesc: "",
          position: 1,
          putOrCall: "call",
          strike: "asdf",
          unrealizedPnl: 0,
          conid: 1,
          ticker: 'UVXY',
        }
      ];

      let newPositions = getNewPositions(a, b);
      expect(newPositions.length).toBe(1);
      expect(newPositions[0].position).toBe(2);

      newPositions = getNewPositions(b, a);
      expect(newPositions.length).toBe(1);
      expect(newPositions[0].position).toBe(1);
    });



    it('should update with new positons', () => {
      let newPositions = getNewPositions(testdata2, TestData);
      expect(newPositions.length).toBe(3);

      expect(newPositions.at(0).fullName).toBe("TBT Dec16'22 23 Call");
      expect(newPositions.at(1).fullName).toBe("VIX Jul05'22 29 Put");
      expect(newPositions.at(2).fullName).toBe("VIX Jul05'22 32.5 Call");

    });



  });
