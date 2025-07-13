import { useState, useEffect } from "react";
import { Trophy, Crown, Medal, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  points: number;
  avatar: string;
}

interface ClaimHistory {
  id: string;
  userId: string;
  userName: string;
  points: number;
  timestamp: Date;
}

const initialUsers: User[] = [
  { id: "1", name: "Rahul", points: 1134590, avatar: "🧑‍💼" },
  { id: "2", name: "Kamal", points: 1614546, avatar: "👨‍🎓" },
  { id: "3", name: "Sanak", points: 942034, avatar: "👩‍💻" },
  { id: "4", name: "Thakur", points: 558378, avatar: "👨‍🚀" },
  { id: "5", name: "Mukku", points: 503042, avatar: "🧑‍🎨" },
  { id: "6", name: "Chetan", points: 352250, avatar: "👨‍🔬" },
  { id: "7", name: "Sahil", points: 346392, avatar: "🧑‍🍳" },
  { id: "8", name: "Rajput", points: 343892, avatar: "👨‍🏫" },
  { id: "9", name: "Sahil K", points: 321932, avatar: "🧑‍🎤" },
  { id: "10", name: "Dev", points: 0, avatar: "🧑‍💻" },
];

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [newUserName, setNewUserName] = useState("");
  const [claimHistory, setClaimHistory] = useState<ClaimHistory[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const claimPoints = () => {
    if (!selectedUserId) {
      toast({
        title: "No user selected",
        description: "Please select a user to claim points for.",
        variant: "destructive",
      });
      return;
    }

    const randomPoints = Math.floor(Math.random() * 10) + 1;
    const selectedUser = users.find(u => u.id === selectedUserId);
    
    if (!selectedUser) return;

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === selectedUserId
          ? { ...user, points: user.points + randomPoints }
          : user
      )
    );

    const historyEntry: ClaimHistory = {
      id: Date.now().toString(),
      userId: selectedUserId,
      userName: selectedUser.name,
      points: randomPoints,
      timestamp: new Date(),
    };

    setClaimHistory(prev => [historyEntry, ...prev].slice(0, 50));

    toast({
      title: "Points Claimed!",
      description: `${selectedUser.name} earned ${randomPoints} points!`,
    });
  };

  const addUser = () => {
    if (!newUserName.trim()) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid user name.",
        variant: "destructive",
      });
      return;
    }

    const avatars = ["🧑‍💼", "👨‍🎓", "👩‍💻", "👨‍🚀", "🧑‍🎨", "👨‍🔬", "🧑‍🍳", "👨‍🏫", "🧑‍🎤", "👩‍🎨"];
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      points: 0,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName("");
    setIsAddingUser(false);

    toast({
      title: "User Added!",
      description: `${newUser.name} has been added to the leaderboard.`,
    });
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-gold";
      case 2: return "text-silver";
      case 3: return "text-bronze";
      default: return "text-foreground";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-gold" />;
      case 2: return <Medal className="w-6 h-6 text-silver" />;
      case 3: return <Trophy className="w-6 h-6 text-bronze" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-secondary/20">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'var(--gradient-winner)' }}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative p-6 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Live Ranking</h1>
          </div>
          <p className="text-sm opacity-90">Settlement time: 2 days 01:45:37</p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{user.avatar}</span>
                    {user.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={claimPoints} 
            disabled={!selectedUserId}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Zap className="w-4 h-4 mr-2" />
            Claim
          </Button>
        </div>

        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter user name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addUser()}
              />
              <div className="flex gap-2">
                <Button onClick={addUser} className="flex-1">Add User</Button>
                <Button variant="outline" onClick={() => setIsAddingUser(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Top 3 Winners */}
      {sortedUsers.length >= 3 && (
        <div className="px-6 mb-6">
          <Card className="overflow-hidden" style={{ background: 'var(--gradient-podium)', boxShadow: 'var(--shadow-winner)' }}>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {/* Second Place */}
                <div className="text-center">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 mx-auto bg-silver/20 rounded-full flex items-center justify-center text-2xl border-4 border-silver">
                      {sortedUsers[1]?.avatar}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-silver rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm">{sortedUsers[1]?.name}</h3>
                  <p className="text-lg font-bold">{sortedUsers[1]?.points.toLocaleString()}</p>
                </div>

                {/* First Place */}
                <div className="text-center -mt-4">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 mx-auto bg-gold/20 rounded-full flex items-center justify-center text-3xl border-4 border-gold">
                      {sortedUsers[0]?.avatar}
                    </div>
                    <div className="absolute -top-3 -right-2 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <Crown className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-semibold">{sortedUsers[0]?.name}</h3>
                  <p className="text-xl font-bold">{sortedUsers[0]?.points.toLocaleString()}</p>
                </div>

                {/* Third Place */}
                <div className="text-center">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 mx-auto bg-bronze/20 rounded-full flex items-center justify-center text-2xl border-4 border-bronze">
                      {sortedUsers[2]?.avatar}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-bronze rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm">{sortedUsers[2]?.name}</h3>
                  <p className="text-lg font-bold">{sortedUsers[2]?.points.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rankings List */}
      <div className="px-6 pb-6">
        <Card>
          <CardContent className="p-0">
            {sortedUsers.slice(3).map((user, index) => {
              const rank = index + 4;
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(rank)}
                    </div>
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-xl">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">Rank #{rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{user.points.toLocaleString()}</p>
                    <Trophy className="w-4 h-4 text-gold inline" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Claims History */}
      {claimHistory.length > 0 && (
        <div className="px-6 pb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Recent Claims
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {claimHistory.slice(0, 10).map((claim) => (
                  <div key={claim.id} className="flex justify-between items-center text-sm p-2 bg-success/10 rounded">
                    <span>{claim.userName} claimed <strong>{claim.points} points</strong></span>
                    <span className="text-muted-foreground">
                      {claim.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}