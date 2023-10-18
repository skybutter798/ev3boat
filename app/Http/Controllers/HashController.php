<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Grid;
use App\Models\BlockHash;
use App\Models\Entry;
use App\Models\Reward;
use App\Models\ShopItem;
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
    
        $pastHashes = \App\Models\BlockHash::orderBy('retrieved_at', 'desc')->paginate(10);
    
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
        Log::channel('hash_info')->info('Called getLatestBlockHash function'); // Log that the function has been called
    
        $apiKey = '3BAH17RC7NK7SRBR8KE41TUNWBIVNYK4DE'; // Replace with your Etherscan API key
        $url = "https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true&apikey=$apiKey";
    
        $client = new Client();
        $response = $client->get($url);
        $data = json_decode($response->getBody(), true);
    
        if (isset($data['result']) && isset($data['result']['hash'])) {
            //$blockHash = $data['result']['hash'];
            $blockHash = "abc01";
            $etherscanLink = "https://etherscan.io/block/$blockHash"; // Construct the Etherscan link
    
            Log::channel('hash_info')->info('Successfully retrieved block hash', ['blockHash' => $blockHash, 'etherscanLink' => $etherscanLink]); // Log the block hash and the Etherscan link
    
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
        Log::error('Failed to retrieve block hash from Etherscan'); // Log an error message if the block hash is not found in the response
    
        return null;
    }



    public function checkWinningEntries($latestBlockHash)
    {
        $lastChar = substr($latestBlockHash, -1);
        $blockHashRecord = \App\Models\BlockHash::where('hash', $latestBlockHash)->first();
    
        if (!$blockHashRecord) {
            return;
        }
    
        $pendingEntries = \App\Models\Entry::where('result', 'pending')->get();
    
        foreach ($pendingEntries as $entry) {
            if ($entry->entry_value == $lastChar) {
                $entry->result = 'win';
                $user = $entry->user; // This uses the relationship you set up
                $user->points += 10;
                $user->save();
               Log::channel('hash_info')->info("User {$user->name} won 10, total point : {$user->points}");
            } else {
                $entry->result = 'lose';
            }
    
            $entry->blockhash_id = $blockHashRecord->id;
            $entry->save();
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
    
    public function getShopItems()
    {
        $items = ShopItem::all();
        return response()->json($items);
    }

    
    public function purchaseItem(Request $request)
    {
        $itemId = $request->input('item_id');
        $user = Auth::user();
    
        $item = \App\Models\ShopItem::find($itemId);
    
        if ($user->points >= $item->cost) {
            $user->points -= $item->cost;
            $user->save();
    
            // Optionally, you can save a record of the purchase in another table
    
            return response()->json(['status' => 'success', 'message' => 'Purchase successful!']);
        } else {
            return response()->json(['status' => 'error', 'message' => 'Not enough points.']);
        }
    }
    
    public function getPastHashes()
    {
        $pastHashes = \App\Models\BlockHash::orderBy('retrieved_at', 'desc')->paginate(10);
        return response()->json($pastHashes);
    }



}