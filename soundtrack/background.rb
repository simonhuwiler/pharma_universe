use_bpm 60

use_synth :dark_ambience
play :c2, attack: 5, sustain: 525, release: 10, amp: 0.5

sleep 10

with_synth :hollow do
  
  play "C4", attack: 5, sustain: 20, release: 2, amp: 0.5
  
  sleep 20
  
  play :e5, attack: 5, sustain: 15, release: 2, amp: 0.5
  
  sleep 20
  
  play_chord [:ds5, :c5, :b4], attack: 5, sustain: 20, release: 10, amp: 0.5
  
  sleep 10
end

with_synth :hollow do
  with_fx :reverb, room: 1 do
    play :c6
    sleep 5
    play :g5
    sleep 1
    play :b5
    sleep 5
    play :fs5
    sleep 1
    play :as5
    sleep 1
    s = play :a5, note_slide: 1, release: 8
    sleep 2
    control s, note: :f5
  end
  
end

sleep 10

with_synth :hollow do
  4.times do
    play_chord [:b3, :d4], attack: 5, sustain: 20, release: 5, amp: 0.5
    
    sleep 20
    
    play_chord [:e4, :f4], attack: 5, sustain: 20, release: 5, amp: 0.5
    
    sleep 20
    
    play_chord [:c4, :e4, :g4, :as5], attack: 5, sustain: 20, release: 5, amp: 0.5
    
    sleep 20
    
    play_chord [:f4, :gs4, :b4, :d5], attack: 5, sustain: 20, release: 5, amp: 0.5
    
    sleep 20
    
    play_chord [:c4, :e4, :g4, :c5], attack: 5, sustain: 20, release: 5, amp: 0.5
    
    sleep 20
  end
  
end






