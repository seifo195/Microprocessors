export const parseInstruction = (instruction) => {
  console.log('Original instruction:', instruction);
  
  // Handle labels by splitting on ':' first
  const [label, ...rest] = instruction.trim().split(':');
  const actualInstruction = rest.length > 0 ? rest.join(':').trim() : label;
  
  const parts = actualInstruction.split(/[\s,]+/).filter(part => part !== '');
  console.log('Parts:', parts);
  
  const opcode = parts[0].toUpperCase();
  
  const result = {
    label: rest.length > 0 ? label : null,
    opcode: opcode,
    rd: null,
    rs: null,
    rt: null,
    immediate: null
  };

  switch (opcode) {
    case 'DADDI':
    case 'DSUBI':
      result.rd = parts[1];
      result.rs = parts[2];
      result.immediate = Number(parts[3]);
      break;

    case 'LW':
    case 'LD':
    case 'L.S':
    case 'L.D':
      if (parts.length === 3) {
        result.rd = parts[1];
        // Check if it's using base register addressing
        if (parts[2].includes('(')) {
          const addressPart = parts[2].match(/(-?\d+)?\(([^)]+)\)/);
          if (addressPart) {
            result.immediate = addressPart[1] ? Number(addressPart[1]) : 0;
            result.rs = addressPart[2];
          }
        } else {
          // Direct addressing
          result.immediate = Number(parts[2]);
        }
      }
      break;

    case 'SW':
    case 'SD':
    case 'S.S':
    case 'S.D':
      if (parts.length === 3) {
        result.rt = parts[1];  // Source register
        // Check if it's using base register addressing
        if (parts[2].includes('(')) {
          const addressPart = parts[2].match(/(-?\d+)?\(([^)]+)\)/);
          if (addressPart) {
            result.immediate = addressPart[1] ? Number(addressPart[1]) : 0;
            result.rs = addressPart[2];  // Base register
          }
        } else {
          // Direct addressing
          result.immediate = Number(parts[2]);
        }
      }
      break;

    case 'BNE':
    case 'BEQ':
      result.rs = parts[1];
      result.rt = parts[2];
      result.immediate = parts[3];  // Keep the label name for branch instructions
      break;

    case 'ADD.D':
    case 'ADD.S':
    case 'SUB.D':
    case 'SUB.S':
    case 'MUL.D':
    case 'MUL.S':
    case 'DIV.D':
    case 'DIV.S':
      result.rd = parts[1];
      result.rs = parts[2];
      result.rt = parts[3];
      break;

    default:
      console.error('Unknown instruction:', opcode);
  }

  console.log('Parsed result:', result);
  return result;
}; 