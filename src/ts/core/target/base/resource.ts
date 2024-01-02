import { schema } from '@/ts/base';

class TargetResource {
  membersMap: Map<string, schema.XTarget[]>;
  constructor() {
    this.membersMap = new Map<string, schema.XTarget[]>();
  }
  membersLoaded(targetId: string): boolean {
    if (this.membersMap.has(targetId)) {
      return true;
    }
    this.membersMap.set(targetId, []);
    return false;
  }
  members(targetId: string): schema.XTarget[] {
    return this.membersMap.get(targetId) || [];
  }
  pullMembers(targetId: string, members: schema.XTarget[]) {
    members = members.filter((i) => this.members(targetId).every((j) => i.id != j.id));
    this.membersMap.set(targetId, [...this.members(targetId), ...members]);
  }
  removeMembers(targetId: string, members: schema.XTarget[]) {
    this.membersMap.set(
      targetId,
      this.members(targetId).filter((i) => members.every((j) => i.id != j.id)),
    );
  }
}

export default new TargetResource();
