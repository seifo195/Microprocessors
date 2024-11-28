class registerFile{
    constructor(name,data,availability){
        this.name = name;
        this.Qi = Qi;
        this.content = content;
    }
}
class loadBuffer{
    constructor(name,busy,address){
        this.name=name;
        this.busy=busy;
        this.address=address;
    }
}
class storeBuffer{
    constructor(busy,A,V,Q,Name){
        this.busy=busy;
        this.A=A;
        this.V=V;
        this.Q=Q;
        this.Name=Name;
    }
}
class AdditionReservationStation{
    constructor(busy,operation,Vi,Vj,Qi,Qj,A,time){
        this.busy=busy;
        this.operation=operation;
        this.Vi=Vi;
        this.Vj=Vj;
        this.Qi=Qi;
        this.Qj=Qj;
        this.A=A;
        this.time=time;
    }
}
class MultiplicationReservationStation{
    constructor(busy,operation,Vi,Vj,Qi,Qj,A,time){
        this.busy=busy;
        this.operation=operation;
        this.Vi=Vi;
        this.Vj=Vj;
        this.Qi=Qi;
        this.Qj=Qj;
        this.A=A;
        this.time=time;
    }
}
class instructionQueue{
    constructor(issue,execute,write){
        this.issue=issue;
        this.execute=execute;
        this.write=write;
    }
}
class cache{
    constructor(tag,validityBit,block,size){
        this.tag=tag;
        this.validityBit=validityBit;
        this.block=block;
        this.size=size;
    }
    
}
class commonDataBus{
    constructor(tag,content){
        this.tag=tag;
        this.content=content;
    }
}