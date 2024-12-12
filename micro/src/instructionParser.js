export const parseInstruction = (instruction) => {
  console.log('Original instruction:', instruction);
  
  // Handle labels by splitting on ':' first
  const [label, ...rest] = instruction.trim().split(':');
  const actualInstruction = rest.length > 0 ? rest.join(':').trim() : label;
  
  const parts = actualInstruction.split(/[\s,]+/);
  console.log('Parts:', parts);
  
  const opcode = parts[0].toUpperCase();
  
  const result = {
    label: rest.length > 0 ? label : null,  // If we found a ':', use the label
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
    case 'SW':
    case 'SD':
    case 'S.S':
    case 'S.D':
      result.rd = parts[1];
      result.immediate = Number(parts[2]);
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

  return result;
}; 