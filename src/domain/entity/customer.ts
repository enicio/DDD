import Address from "./address";

export default class Customer {

    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this._active = false;
        this.validate();
    }
    //Espressividade, por isso não usar simplesmente get e set
    //Entidade é responsável por si mesma e deve sempre se validar
    changeName(name: string) {
        if (name.length === 0) {
            throw new Error("Name cannot be a empty value");
        }
        this._name = name;
    }

    activate() {
        if (this._address  === undefined) {
            throw new Error("Address is required to activate customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    setAddress(address: Address) {
        this._address = address;
    };

    get rewardPoints(): number {
        return this._rewardPoints;
    };

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    };

    get id(): string {
        return this._id;
    };

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }
}