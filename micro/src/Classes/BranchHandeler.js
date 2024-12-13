class BranchHandler {
    handleBranch(instruction, registers) {
        const [op, rs1, rs2, target] = instruction;
        const val1 = registers.get(rs1);
        const val2 = registers.get(rs2);
        
        switch(op) {
            case 'BEQ':
                return val1 === val2 ? target : null;
            case 'BNE':
                return val1 !== val2 ? target : null;
            default:
                throw new Error(`Unknown branch type: ${op}`);
        }
    }
}

module.exports = BranchHandler;
