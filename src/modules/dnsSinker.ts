const DnsSinker = (msg: Buffer, rCode: number): Buffer => {
  const idBuff = Buffer.alloc(2);
  idBuff.writeUIntBE(msg.readUintBE(0, 2), 0, 2);
  const errorFlagBuff = Buffer.alloc(2);
  errorFlagBuff.writeUIntBE((msg.readUintBE(2, 2) & (((1 << 12) - 1) << 4)) + rCode, 0, 2);
  const restOfBuff = Buffer.alloc(msg.byteLength - 4);
  let restOfByte = msg.byteLength - 4;
  let restOffset = 4;
  while(restOfByte >= 6) {
    restOfBuff.writeUIntBE(msg.readUIntBE(restOffset, 6), 0, 6);
    restOfByte -= 6;
    restOffset += 6;
  }
  if(restOfByte != 0) {
    restOfBuff.writeUIntBE(msg.readUIntBE(restOffset, restOfByte), 0, restOfByte);
  }
  const errorResBuff = Buffer.concat([idBuff, errorFlagBuff, restOfBuff]);

  return errorResBuff;
};

export default DnsSinker;