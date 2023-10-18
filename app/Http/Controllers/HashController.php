<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Grid;
use App\Models\BlockHash;
use App\Models\Entry;
use App\Models\Reward;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Abraham\TwitterOAuth\TwitterOAuth;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;


class HashController extends Controller
{
    public function index()
    {
        $remainingClicks = 0; // Default value
        $remain = \App\Models\Grid::where('clicked', 0)->where('reward_item_id', 1)->get();
        $password = config('assets.password');
        
        if (Auth::check()) {
            $user = Auth::user();
        
            // Check how many entries the user has made today
            $todayClicks = \App\Models\Entry::where('user_id', $user->id)
                         ->whereDate('created_at', Carbon::now('Asia/Kuala_Lumpur')->toDateString())
                         ->count();
                             
            if ($todayClicks > 2) {
                $remainingClicks = 0;
            } else {
                $remainingClicks = 3 - $todayClicks;
            }
        }
        $userCriteriaFulfilled = false;
    
        if (Auth::check()) {
            $user = Auth::user();
            $grid = Grid::where('user_id', $user->id)
                        ->where('clicked', 1)
                        ->where('reward_item_id', 2)
                        ->first();
            
            if ($grid) {
                $userCriteriaFulfilled = true;
            }
        }
        
        $grids = Grid::all();
        
        // Fetch the latest block hash record
        $latestBlockHash = \App\Models\BlockHash::latest('created_at')->first();
        
        $userEntries = [];
        if (Auth::check()) {
            $user = Auth::user();
            $userEntries = \App\Models\Entry::where('user_id', $user->id)
                ->join('block_hashes', 'entries.blockhash_id', '=', 'block_hashes.id')
                ->select('entries.*', 'block_hashes.hash as actual_result', 'block_hashes.link as hash_link')
                ->orderBy('entries.created_at', 'desc')
                ->get();

        }
    
        $pastHashes = \App\Models\BlockHash::orderBy('retrieved_at', 'desc')->get();
    
        return view('hash', compact('grids', 'remainingClicks', 'remain', 'password', 'userCriteriaFulfilled', 'userEntries', 'pastHashes', 'latestBlockHash'));
    }

    
    public function handleButtonClick(Request $request)
    {
        $buttonValue = $request->input('buttonValue');
    
        if (!Auth::check()) {
            return response()->json(['message' => 'User not authenticated'], 403);
        }
    
        $user = Auth::user();
    
        $todayClicks = \App\Models\Entry::where('user_id', $user->id)
                     ->whereDate('created_at', Carbon::now('Asia/Kuala_Lumpur')->toDateString())
                     ->count();
                     
        if ($todayClicks >= 3) {
            return response()->json(['status' => 'error', 'message' => 'No clicks remaining for today']);
        }
    
        // Store the user's entry
        $entry = new \App\Models\Entry();
        $entry->user_id = $user->id;
        $entry->entry_value = $buttonValue;
        $entry->save();
        
        $remainingClicks = 3 - \App\Models\Entry::where('user_id', $user->id)
                     ->whereDate('created_at', Carbon::now('Asia/Kuala_Lumpur')->toDateString())
                     ->count();
        
        return response()->json(['status' => 'success', 'message' => 'Entry saved. Wait for the result.', 'remainingClicks' => $remainingClicks]);
        
    }



    
    public function getLatestBlockHash()
    {
        $apiKey = '3BAH17RC7NK7SRBR8KE41TUNWBIVNYK4DE'; // Replace with your Etherscan API key
        $url = "https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true&apikey=$apiKey";
    
        $client = new Client();
        $response = $client->get($url);
        $data = json_decode($response->getBody(), true);
    
        if (isset($data['result']) && isset($data['result']['hash'])) {
            $blockHash = $data['result']['hash'];
            $etherscanLink = "https://etherscan.io/block/$blockHash"; // Construct the Etherscan link
    
            // Store the block hash in the database
            $blockHashModel = new BlockHash;
            $blockHashModel->hash = $blockHash;
            $blockHashModel->link = $etherscanLink;
            $blockHashModel->retrieved_at = now(); // Current timestamp
            $blockHashModel->save();
            
            // Check the winning entries after saving the block hash
            $this->checkWinningEntries($blockHash);
    
            return [
                'blockHash' => $blockHash,
                'etherscanLink' => $etherscanLink
            ];
        }
    
        return null;
    }


    public function checkWinningEntries($latestBlockHash)
    {
        // Extract the last character of the block hash
        $lastChar = substr($latestBlockHash, -1);
    
        // Fetch the block hash record from the database
        $blockHashRecord = \App\Models\BlockHash::where('hash', $latestBlockHash)->first();
    
        if (!$blockHashRecord) {
            // Handle the case where the block hash record is not found
            // You can either return an error or log it
            return;
        }
    
        // Fetch all entries with a status of 'pending'
        $pendingEntries = \App\Models\Entry::where('result', 'pending')->get();
    
        foreach ($pendingEntries as $entry) {
            if ($entry->entry_value == $lastChar) {
                $entry->result = 'win'; // Update status to 'win' if it matches the block hash
            } else {
                $entry->result = 'lose'; // Update status to 'lose' if it doesn't match
            }
    
            // Link the entry to the block hash record
            $entry->blockhash_id = $blockHashRecord->id;
    
            $entry->save(); // Save the updated status and blockhash_id
        }
    }
    
    public function getUserEntries() {
        if (Auth::check()) {
            $user = Auth::user();
            $userEntries = \App\Models\Entry::where('user_id', $user->id)
                ->leftJoin('block_hashes', 'entries.blockhash_id', '=', 'block_hashes.id') // Use leftJoin here
                ->select('entries.*', 'block_hashes.hash as actual_result', 'block_hashes.link as hash_link')
                ->orderBy('entries.created_at', 'desc')
                ->get();
    
            return response()->json($userEntries);
        }
        return response()->json([]);
    }





    
}