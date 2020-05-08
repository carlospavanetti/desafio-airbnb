export class RemoteStaysSource {
  constructor(location) {
    this.location = location;
  }

  async stays() {
    const response = await fetch(this.location);
    return response.json();
  }
}
